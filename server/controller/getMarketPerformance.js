const pool = require("../model/db");

const get_market_performance = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Find the seller belonging to the logged-in user
    const sellerResult = await pool.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [userId]
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // 2. Get all marketplaces owned by the seller
    const marketsResult = await pool.query(
      `SELECT *
       FROM markets
       WHERE owner_id = $1
       ORDER BY created_at DESC`,
      [seller.id]
    );

    const markets = marketsResult.rows;

    // 3. Return the marketplaces
    return res.status(200).json({
      success: true,
      markets,
    });
  } catch (error) {
    console.error("Get market performance error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { get_market_performance };
