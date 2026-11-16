import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateOtp } from "../utils/generateOtp.js";
import { EmailDeliveryError, sendEmail } from "../utils/sendEmail.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const createAuthToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

export const register = async (req, res) => {
  try {
    // 1. Get the user's details from the request
    const { name, email, password } = req.body;

    // 2. Validate the input
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required."
      });
    }

    if (!isValidEmail(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long."
      });
    }

    // 3. Normalize the email
    const normalizedEmail = email.trim().toLowerCase();
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("Registration error: JWT_SECRET is not configured.");
      return res.status(500).json({
        message: "Authentication is not configured on the server."
      });
    }

    // 4. Check if the email already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    // 5. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Save the user in the database
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, is_verified, created_at`,
      [name.trim(), normalizedEmail, hashedPassword]
    );

    const newUser = result.rows[0];
    const token = createAuthToken(newUser.id);

    // 7. Send the response
    return res.status(201).json({
      message: "Account created successfully!",
      token,
      user: newUser
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate emails, including simultaneous requests
    if (error.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    return res.status(500).json({
      message: "Something went wrong while creating your account."
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    if (!isValidEmail(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address."
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Login error: JWT_SECRET is not configured.");
      return res.status(500).json({
        message: "Authentication is not configured on the server."
      });
    }

    // 2. Find user
    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT id, name, email, password, is_verified FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const user = result.rows[0];

    // 3. Compare passwords
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // 4. Generate JWT
    const token = createAuthToken(user.id);

    // 5. Return response
    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong while logging in."
    });
  }
};


export const getMe = async (req, res) => {
  try {
    // Get the authenticated user's ID from the JWT
    const userId = req.user.userId;

    // Find the user in the database
    const result = await pool.query(
      `SELECT id, name, email, is_verified, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully.",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      message: "Something went wrong."
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    // 1. Validate the new name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "A valid name is required."
      });
    }

    const updatedName = name.trim();

    // 2. Update the authenticated user's profile
    const result = await pool.query(
      `UPDATE users
       SET name = $1
       WHERE id = $2
       RETURNING id, name, email, is_verified, created_at`,
      [updatedName, userId]
    );

    // 3. Check whether the user exists
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User account not found."
      });
    }

    // 4. Return updated profile
    return res.status(200).json({
      message: "Profile updated successfully.",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Something went wrong while updating your profile."
    });
  }
};


export const requestEmailChange = async (req, res) => {
  let emailStatus = "not_attempted";

  try {
    const userId = req.user.userId;
    const { newEmail } = req.body;

    if (typeof newEmail !== "string" || !newEmail.trim()) {
      return res.status(400).json({
        message: "A valid new email address is required.",
      });
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const userResult = await pool.query(
      `SELECT email, is_verified
       FROM users
       WHERE id = $1`,
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User account not found.",
      });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your current email before changing it.",
      });
    }

    if (normalizedEmail === user.email.toLowerCase()) {
      return res.status(400).json({
        message: "Your new email is the same as your current email.",
      });
    }

    const existingEmail = await pool.query(
      `SELECT id FROM users WHERE LOWER(email) = $1`,
      [normalizedEmail]
    );

    if (existingEmail.rowCount > 0) {
      return res.status(409).json({
        message: "This email address is already in use.",
      });
    }

    const otp = await generateOtp();
    const code = otp.replace("thrift-", "");
    const hashedCode = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sendEmail(
      user.email,
      "Verify your Thriftify email change",
      {
        template: "profile-update-verification",
        data: { code },
        text: `Your Thriftify email change verification code is ${code}. It expires in 10 minutes.`,
      }
    );
    emailStatus = "accepted_by_mail_server";

    await pool.query(
      `UPDATE users
       SET pending_email = $1,
           verification_code = $2,
           verification_expires = $3
       WHERE id = $4`,
      [normalizedEmail, hashedCode, expiresAt, userId]
    );

    return res.status(200).json({
      message: "The verification email was accepted by the mail server.",
      emailStatus: "accepted_by_mail_server",
    });
  } catch (error) {
    console.error("Email change request error:", error);

    if (error instanceof EmailDeliveryError) {
      console.error("Email delivery details:", error.cause || error);
      emailStatus = error.emailStatus;
      return res.status(502).json({
        message: error.emailStatus === "rejected"
          ? "The mail server rejected the verification email."
          : "Couldn't confirm whether the mail server accepted the verification email.",
        emailStatus,
      });
    }

    return res.status(500).json({
      message: "Couldn't complete the email change request. Please try again.",
      emailStatus,
    });
  }
};



export const confirmEmailChange = async (req, res) => {
  const userId = req.user.userId;
  let emailStatus = "not_attempted";
  const otp = typeof req.body.otp === "string"
    ? req.body.otp.trim()
    : "";

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({
      message: "Please enter a valid 6-digit verification code.",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `SELECT email, pending_email, verification_code,
              verification_expires
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "User account not found.",
      });
    }

    if (
      !user.pending_email ||
      !user.verification_code ||
      !user.verification_expires ||
      new Date(user.verification_expires) <= new Date()
    ) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Verification code has expired. Request a new one.",
      });
    }

    const isMatch = await bcrypt.compare(
      `thrift-${otp}`,
      user.verification_code
    );

    if (!isMatch) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Incorrect verification code.",
      });
    }

    const newOtp = await generateOtp();
    const newCode = newOtp.replace("thrift-", "");
    const hashedNewCode = await bcrypt.hash(newOtp, 10);
    const newExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sendEmail(
      user.pending_email,
      "Verify your new Thriftify email address",
      {
        template: "profile-update-verification",
        data: { code: newCode },
        text: `Your Thriftify new email verification code is ${newCode}. It expires in 10 minutes.`,
      }
    );
    emailStatus = "accepted_by_mail_server";

    await client.query(
      `UPDATE users
       SET verification_code = NULL,
           verification_expires = NULL,
           pending_email_verification_code = $1,
           pending_email_verification_expires = $2
       WHERE id = $3`,
      [hashedNewCode, newExpiresAt, userId]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      message: "Your current email is verified. The verification email for your new address was accepted by the mail server.",
      emailStatus: "accepted_by_mail_server",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Current email confirmation error:", error);

    if (error instanceof EmailDeliveryError) {
      console.error("Email delivery details:", error.cause || error);
      emailStatus = error.emailStatus;
      return res.status(502).json({
        message: error.emailStatus === "rejected"
          ? "Your current email wasn't changed because the mail server rejected a verification email for your new address."
          : "Your current email wasn't changed because the server couldn't confirm whether the verification email for your new address was accepted.",
        emailStatus,
      });
    }

    return res.status(500).json({
      message: "Couldn't complete the email change. Please try again.",
      emailStatus,
    });
  } finally {
    client.release();
  }
};


