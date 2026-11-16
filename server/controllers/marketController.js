import pool from "../config/db.js";

export const getAllMarkets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        description,
        logo,
        banner
       FROM markets
       WHERE status = $1
       ORDER BY created_at DESC`,
      ["active"]
    );

    return res.status(200).json({
      message: "Markets retrieved successfully.",
      markets: result.rows,
    });
  } catch (error) {
    console.error("Get markets error:", error);

    return res.status(500).json({
      message: "An error occurred while retrieving markets.",
    });
  }
};

export const getMarketProducts = async (req, res) => {
  try {
    const { marketId } = req.params;

    // Validate market ID
    if (!Number.isInteger(Number(marketId)) || Number(marketId) <= 0) {
      return res.status(400).json({
        message: "Invalid market ID.",
      });
    }

    // Check whether market exists and is active
    const market = await pool.query(
      `SELECT id, name, description, logo, banner
       FROM markets
       WHERE id = $1 AND status = $2`,
      [marketId, "active"]
    );

    if (market.rows.length === 0) {
      return res.status(404).json({
        message: "Market not found or unavailable.",
      });
    }

    // Retrieve products belonging to the market
    const result = await pool.query(
      `SELECT
          p.id,
          p.market_id,
          p.name,
          p.description,
          p.category,
          p.condition,
          p.price,
          p.quantity,
          COALESCE(
              JSON_AGG(
                  JSON_BUILD_OBJECT(
                      'id', pi.id,
                      'image_url', pi.image_url,
                      'is_primary', pi.is_primary,
                      'display_order', pi.display_order
                  )
                  ORDER BY pi.display_order ASC
              ) FILTER (WHERE pi.id IS NOT NULL),
              '[]'
          ) AS images,
          MAX(pi.image_url) FILTER (WHERE pi.is_primary = true) AS primary_image
       FROM products p
       LEFT JOIN product_images pi
          ON p.id = pi.product_id
       WHERE p.market_id = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC`,
      [marketId]
    );

    return res.status(200).json({
      message: "Market products retrieved successfully.",
      market: market.rows[0],
      products: result.rows,
    });
  } catch (error) {
    console.error("Get market products error:", error);

    return res.status(500).json({
      message: "An error occurred while retrieving market products.",
    });
  }
};