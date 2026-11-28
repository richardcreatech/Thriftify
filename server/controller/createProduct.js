const pool = require("../model/db");
const { uploadImageToCloudinary } = require("../utils/uploadImage");

const createProduct = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { name, description, category, condition, price, quantity } =
      req.body;

    // 1. Validate product details
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (typeof category !== "string" || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please select a category.",
      });
    }

    const productPrice = Number(price);
    const productQuantity = Number(quantity);

    if (
      price === undefined ||
      price === "" ||
      !Number.isFinite(productPrice) ||
      productPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number.",
      });
    }

    if (
      quantity === undefined ||
      quantity === "" ||
      !Number.isSafeInteger(productQuantity) ||
      productQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid non-negative whole number.",
      });
    }

    // 2. Find the seller
    const sellerResult = await pool.query(
      "SELECT id FROM sellers WHERE user_id = $1",
      [req.user.id],
    );

    const seller = sellerResult.rows[0];

    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "You must be a seller to create products.",
      });
    }

    // 3. Verify marketplace ownership
    const marketResult = await pool.query(
      `SELECT id
       FROM markets
       WHERE id = $1 AND owner_id = $2`,
      [marketId, seller.id],
    );

    const market = marketResult.rows[0];

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Marketplace not found or you do not own it.",
      });
    }

    // 4. Require an image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image.",
      });
    }

    // 5. Upload image to Cloudinary
    const uploadResult = await uploadImageToCloudinary(req.file);

    if (!uploadResult?.url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image.",
      });
    }

    // 6. Insert product
    const productResult = await pool.query(
      `INSERT INTO products (
     market_id,
     name,
     description,
     category,
     condition,
     price,
     quantity
   )
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING *`,
      [
        market.id,
        name.trim(),
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
        category.trim(),
        condition,
        productPrice,
        productQuantity,
      ],
    );

    const product = productResult.rows[0];

    // 7. Save the image against the new product
    await pool.query(
      `INSERT INTO product_images (
         product_id, image_url, is_primary, display_order
       )
       VALUES ($1, $2, TRUE, 0)`,
      [product.id, uploadResult.url],
    );

    // 8. Retrieve all products with their images
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
         ) AS images
       FROM products p
       WHERE p.market_id = $1
       ORDER BY p.created_at DESC, p.id DESC`,
      [market.id],
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
      products: productsResult.rows,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { createProduct };
