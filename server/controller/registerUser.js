const pool = require("../model/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp } = require("../utils/generateOtp");
const { sendEmail } = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // 1. Check whether the email already exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const existingUser = result.rows[0];

    // 2. Reject an already verified account
    if (existingUser?.is_verified) {
      return res.status(409).json({
        message: "Email is already registered. Please log in instead.",
      });
    }

    // 3. Generate and hash the OTP
    const otp = await generateOtp();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const verificationExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    let user;

    // 4. Update an existing, unverified user
    if (existingUser) {
      const updatedUser = await pool.query(
        `UPDATE users
         SET verification_code = $1,
             verification_expires = $2,
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [hashedOTP, verificationExpires, existingUser.id]
      );

      user = updatedUser.rows[0];
    } else {
      // 5. Create a new user
      const newUser = await pool.query(
        `INSERT INTO users (
           email,
           verification_code,
           verification_expires,
           is_verified
         )
         VALUES ($1, $2, $3, FALSE)
         RETURNING *`,
        [email, hashedOTP, verificationExpires]
      );

      user = newUser.rows[0];
    }

    // 6. Send the verification email
    try {
      await sendEmail(
        email,
        "Verify your Thriftify account",
        {
          template: "account-verification",
          data: { code: otp.replace("thrift-", "") },
          text: `Your Thriftify verification code is ${otp.replace("thrift-", "")}. It expires in 10 minutes.`,
        }
      );
    } catch (err) {
      console.error("Verification email failed:", err.message);

      return res.status(500).json({
        message: "Couldn't send verification email. Please try again.",
      });
    }

    // 7. Create the registration token
    const onboardingToken = jwt.sign(
      {
        id: user.id,
        type: "registration",
      },
      "thrift-hush",
      {
        expiresIn: "30m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully.",
      token: onboardingToken,
    });
  } catch (err) {
    console.error("Registration error:", err);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports = { register };
