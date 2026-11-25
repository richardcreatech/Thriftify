const pool = require("../model/db");

const set_username = async (req, res) => {
  try {
    let { username } = req.body;

    username = username?.trim().toLowerCase();

    if (!username) {
      return res.status(400).json({
        message: "Username is required.",
      });
    }

    // 1. Find the user
    const userResult = await pool.query(
      `SELECT id, name, email, is_verified, password
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 2. Check onboarding requirements
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email first.",
      });
    }

    if (!user.password) {
      return res.status(403).json({
        message: "Please create a password first.",
      });
    }

    if (!user.name?.trim()) {
      return res.status(403).json({
        message: "Please complete your profile first.",
      });
    }

    // 3. Check whether the username is already taken
    const usernameResult = await pool.query(
      "SELECT id FROM sellers WHERE username = $1",
      [username]
    );

    if (usernameResult.rowCount > 0) {
      return res.status(409).json({
        message: "Username already taken.",
      });
    }

    // 4. Create the seller account
    await pool.query(
      `INSERT INTO sellers (user_id, username, display_name)
       VALUES ($1, $2, $3)`,
      [user.id, username, user.name]
    );

    return res.status(201).json({
      success: true,
      message: "Seller account created successfully.",
    });
  } catch (err) {
    // PostgreSQL unique-constraint violation
    if (err.code === "23505") {
      return res.status(409).json({
        message: "Username already taken or seller account already exists.",
      });
    }

    console.error("Set username error:", err);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports = { set_username };