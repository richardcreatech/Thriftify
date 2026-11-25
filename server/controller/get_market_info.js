const pool = require("../model/db");

const getMarketInfo = async (req, res) => {
  try {
    const { marketId } = req.params;
    const userId = req.user.id;

    // 1. Check whether the logged-in user is a seller
    const sellerResult = await pool.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [userId],
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "You must be a seller to access this market info.",
      });
    }

    // 2. Find the marketplace and check ownership
    const marketResult = await pool.query(
      `SELECT *
       FROM markets
       WHERE id = $1 AND owner_id = $2`,
      [marketId, seller.id],
    );

    const market = marketResult.rows[0];

    if (!market) {
      const existsResult = await pool.query(
        "SELECT id FROM markets WHERE id = $1",
        [marketId],
      );

      if (existsResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Marketplace not found.",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this marketplace info.",
      });
    }

    // 3. Retrieve products, their images, and their ratings
    const productsResult = await pool.query(
      `SELECT
         p.*,

         COALESCE(
           (
             SELECT json_agg(
               json_build_object(
                 'id', pi.id,
                 'image_url', pi.image_url,
                 'is_primary', pi.is_primary,
                 'display_order', pi.display_order
               )
               ORDER BY pi.display_order ASC, pi.id ASC
             )
             FROM product_images pi
             WHERE pi.product_id = p.id
           ),
           '[]'::json
         ) AS images,

         COALESCE(
           (
             SELECT ROUND(AVG(pr.rating)::numeric, 1)
             FROM product_reviews pr
             WHERE pr.product_id = p.id
           ),
           0
         ) AS average_rating,

         (
           SELECT COUNT(*)
           FROM product_reviews pr
           WHERE pr.product_id = p.id
         ) AS review_count

       FROM products p
       WHERE p.market_id = $1
       ORDER BY p.created_at DESC, p.id DESC`,
      [market.id],
    );

    // 4. Return the marketplace with its products
    return res.status(200).json({
      success: true,
      market: {
        ...market,
        products: productsResult.rows,
      },
    });
  } catch (error) {
    console.error("Get market info error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { getMarketInfo };
