const pool = require("../model/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const sign_in = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // 1. Find the user in PostgreSQL
    const result = await pool.query(
      `SELECT id, email, password, is_verified
       FROM users
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // 2. Check whether a password has been created
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Please create a password first.",
      });
    }

    // 3. Compare the submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // 4. Create the JWT
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET || "secret_word",
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { sign_in };
