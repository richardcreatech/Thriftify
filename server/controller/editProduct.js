const pool = require("../model/db");

const edit_product = async (req, res) => {
  try {
    const { marketId, productId } = req.params;
    const { name, description, category, condition, price, quantity } =
      req.body;

    // 1. Find the seller
    const sellerResult = await pool.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [req.user.id]
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // 2. Verify marketplace ownership
    const marketResult = await pool.query(
      `SELECT id
       FROM markets
       WHERE id = $1 AND owner_id = $2`,
      [marketId, seller.id]
    );

    const market = marketResult.rows[0];

    if (!market) {
      const existsResult = await pool.query(
        "SELECT id FROM markets WHERE id = $1",
        [marketId]
      );

      if (!existsResult.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Marketplace not found.",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this marketplace.",
      });
    }

    // 3. Build the update
    const updates = [];
    const values = [];

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty.",
        });
      }

      values.push(name.trim());
      updates.push(`name = $${values.length}`);
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res.status(400).json({
          success: false,
          message: "Description must be a string.",
        });
      }

      values.push(description.trim() || null);
      updates.push(`description = $${values.length}`);
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid category.",
        });
      }

      values.push(category.trim());
      updates.push(`category = $${values.length}`);
    }

    if (condition !== undefined) {
      if (typeof condition !== "string" || !condition.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select a valid condition.",
        });
      }

      values.push(condition.trim());
      updates.push(`condition = $${values.length}`);
    }

    if (price !== undefined) {
      const productPrice = Number(price);

      if (
        price === "" ||
        !Number.isFinite(productPrice) ||
        productPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid non-negative number.",
        });
      }

      values.push(productPrice);
      updates.push(`price = $${values.length}`);
    }

    if (quantity !== undefined) {
      const productQuantity = Number(quantity);

      if (
        quantity === "" ||
        !Number.isSafeInteger(productQuantity) ||
        productQuantity < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be a valid non-negative whole number.",
        });
      }

      values.push(productQuantity);
      updates.push(`quantity = $${values.length}`);
    }

    if (!updates.length) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update.",
      });
    }

    // 4. Update only the product belonging to this market
    values.push(productId);
    const productIdPosition = values.length;

    values.push(market.id);
    const marketIdPosition = values.length;

    const productResult = await pool.query(
      `UPDATE products
       SET ${updates.join(", ")},
           updated_at = NOW()
       WHERE id = $${productIdPosition}
         AND market_id = $${marketIdPosition}
       RETURNING *`,
      values
    );

    const product = productResult.rows[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in this marketplace.",
      });
    }

    // 5. Fetch the updated product with its images
    const updatedProductResult = await pool.query(
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
       WHERE p.id = $1`,
      [product.id]
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProductResult.rows[0],
    });
  } catch (err) {
    console.error("Edit product error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { edit_product };
