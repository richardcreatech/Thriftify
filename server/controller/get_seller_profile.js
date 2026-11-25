
const pool = require("../model/db");

const get_seller_profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
        s.id,
        s.user_id,
        s.display_name,
        s.username,
        s.profile_picture_url,
        s.cover_photo,
        s.bio,
        s.phone_number,
        s.country,
        s.state,
        s.city,
        s.bank_name,
        s.account_name,
        s.account_number,
        s.is_verified,
        s.total_sales,
        s.total_products,
        s.followers,
        s.status,
        s.created_at,
        (
          SELECT COUNT(*)
          FROM markets m
          WHERE m.owner_id = s.id
        )::INTEGER AS marketplace_count
      FROM sellers s
      WHERE s.user_id = $1`,
      [userId]
    );

    const seller = result.rows[0];

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    console.error("Get seller profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve seller profile.",
    });
  }
};

module.exports = { get_seller_profile };