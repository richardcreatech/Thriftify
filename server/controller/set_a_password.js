const pool = require("../model/db");
const bcrypt = require("bcryptjs");

const set_a_password = async (req, res) => {
  try {
    const { password } = req.body;

    // 1. Validate password
    if (!password) {
      return res.status(400).json({
        message: "Password is required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // 2. Get authenticated user
    const result = await pool.query(
      "SELECT id, is_verified FROM users WHERE id = $1",
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 3. Ensure email is verified
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first.",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save password in PostgreSQL
    await pool.query(
      `UPDATE users
       SET password = $1,
           updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password created successfully.",
    });
  } catch (err) {
    console.error("Set password error:", err);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports = { set_a_password };
