import pool from "../config/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.category,
        p.condition,
        p.price,
        p.quantity,
        m.id AS market_id,
        m.name AS market_name,
        pi.image_url AS image
      FROM products p
      JOIN markets m
        ON p.market_id = m.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY is_primary DESC, created_at ASC
        LIMIT 1
      ) pi ON TRUE
      WHERE m.status = 'active'
      ORDER BY p.created_at DESC;
    `);

    return res.status(200).json({
      message: "Products fetched successfully!",
      products: result.rows,
    });
  } catch (error) {
    console.error("Fetch products error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching products.",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.category,
        p.condition,
        p.price,
        p.quantity,
        m.id AS market_id,
        m.name AS market_name,
        pi.image_url AS image
      FROM products p
      JOIN markets m
        ON p.market_id = m.id
      LEFT JOIN LATERAL (
        SELECT image_url
        FROM product_images
        WHERE product_id = p.id
        ORDER BY is_primary DESC, created_at ASC
        LIMIT 1
      ) pi ON TRUE
      WHERE p.id = $1
        AND m.status = 'active';
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully!",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Fetch product error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching the product.",
    });
  }
};
