const pool = require("../model/db");

const delete_product = async (req, res) => {
  const client = await pool.connect();

  try {
   const { marketId, productId } = req.params;

console.log("Delete product params:", {
  marketId,
  productId,
});

    await client.query("BEGIN");

    // 1. Find the seller
    const sellerResult = await client.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [req.user.id]
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      await client.query("ROLLBACK");

      return res.status(403).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // 2. Verify marketplace ownership
    const marketResult = await client.query(
      `SELECT id
       FROM markets
       WHERE id = $1 AND owner_id = $2`,
      [marketId, seller.id]
    );

    const market = marketResult.rows[0];

    if (!market) {
      const existsResult = await client.query(
        "SELECT id FROM markets WHERE id = $1",
        [marketId]
      );

      await client.query("ROLLBACK");

      if (!existsResult.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Marketplace not found.",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete products from this marketplace.",
      });
    }

    // 3. Delete the product, only if it belongs to this market
    const productResult = await client.query(
      `DELETE FROM products
       WHERE id = $1 AND market_id = $2
       RETURNING *`,
      [productId, market.id]
    );

    const deletedProduct = productResult.rows[0];

    if (!deletedProduct) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Product not found in this marketplace.",
      });
    }

    // 4. Fetch the remaining products with their images
    const productsResult = await client.query(
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
         ) AS images
       FROM products p
       WHERE p.market_id = $1
       ORDER BY p.created_at DESC, p.id DESC`,
      [market.id]
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      productId: deletedProduct.id,
      products: productsResult.rows,
    });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});

    console.error("Delete product error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  } finally {
    client.release();
  }
};

module.exports = { delete_product };
