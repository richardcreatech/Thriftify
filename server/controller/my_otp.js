const pool = require("../model/db");
const bcrypt = require("bcryptjs");

const verifyOtp = async (req, res) => {
  try {
    // 1. Find the user using the ID from the token
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 2. Get the six-digit OTP from the frontend
    let { otp } = req.body;
    otp = typeof otp === "string" ? otp.trim() : "";

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Please enter a valid 6-digit verification code.",
      });
    }

    // 3. Check whether the OTP exists and has not expired
    if (
      !user.verification_code ||
      !user.verification_expires ||
      new Date(user.verification_expires) <= new Date()
    ) {
      return res.status(400).json({
        message: "Verification code has expired.",
      });
    }

    // 4. Add the prefix on the backend
    const verificationCode = `thrift-${otp}`;

    // Compare the complete code against the stored hash
    const isMatch = await bcrypt.compare(
      verificationCode,
      user.verification_code
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect verification code.",
      });
    }

    // 5. Mark the user as verified and clear the OTP
    await pool.query(
      `UPDATE users
       SET is_verified = TRUE,
           verification_code = '',
           verification_expires = NULL,
           updated_at = NOW()
       WHERE id = $1`,
      [user.id]
    );

    // 6. Return success
    return res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (err) {
    console.error("OTP verification error:", err);

    return res.status(500).json({
      message: "Something went wrong while verifying your email.",
    });
  }
};

module.exports = { verifyOtp };
