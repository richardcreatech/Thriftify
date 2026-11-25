const pool = require("../model/db");

const set_name = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // 1. Validate the names
    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({
        message: "First and last name are required.",
      });
    }

    // 2. Combine the names
    const name = `${firstName.trim()} ${lastName.trim()}`;

    // 3. Update the user's name in PostgreSQL
    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING id`,
      [name, req.user.id]
    );

    // 4. Check whether the user exists
    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Name saved successfully.",
    });
  } catch (err) {
    console.error("Set name error:", err);

    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

module.exports = { set_name };
