const pool = require("../model/db");

const getMarketplaces = async (req, res) => {
  try {
    // 1. Find the seller belonging to the logged-in user
    const sellerResult = await pool.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [req.user.id]
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found.",
      });
    }

    // 2. Find all marketplaces owned by that seller
    const marketResult = await pool.query(
      `SELECT *
       FROM markets
       WHERE owner_id = $1
       ORDER BY created_at DESC`,
      [seller.id]
    );

    // 3. Return the marketplaces
    return res.status(200).json({
      marketplaces: marketResult.rows,
    });
  } catch (err) {
    console.error("Get marketplaces error:", err);

    return res.status(500).json({
      message: "Failed to retrieve marketplaces.",
    });
  }
};

module.exports = { getMarketplaces };
