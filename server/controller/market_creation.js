const pool = require("../model/db");
const { uploadImageToS3 } = require("../utils/putObject");

const create_a_market = async (req, res) => {
  try {
    const { name, description, target_funds } = req.body;
    const userId = req.user.id;

    // 1. Validate the marketplace name
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Marketplace name is required.",
      });
    }

    // 2. Validate target funds
    const targetFunds =
      target_funds === undefined ||
      target_funds === null ||
      target_funds === ""
        ? 0
        : Number(target_funds);

    if (!Number.isFinite(targetFunds) || targetFunds < 0) {
      return res.status(400).json({
        success: false,
        message: "Target funds must be a valid non-negative number.",
      });
    }

    // 3. Find the seller belonging to the logged-in user
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

    // 4. Require a marketplace image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a marketplace image.",
      });
    }

    // 5. Upload the image to S3
    const uploadedImage = await uploadImageToS3(req.file);

    if (!uploadedImage?.url) {
      throw new Error("Failed to upload marketplace image.");
    }

    const logo = uploadedImage.url;

    // 6. Create the marketplace
    const marketResult = await pool.query(
      `INSERT INTO markets (
        owner_id,
        name,
        description,
        logo,
        target_funds
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        seller.id,
        name.trim(),
        description?.trim() || null,
        logo,
        targetFunds,
      ]
    );

    const marketplace = marketResult.rows[0];

    // 7. Retrieve all marketplaces belonging to this seller
    const marketsResult = await pool.query(
      `SELECT *
       FROM markets
       WHERE owner_id = $1
       ORDER BY created_at DESC`,
      [seller.id]
    );

    // 8. Return the created marketplace and seller's marketplaces
    return res.status(201).json({
      success: true,
      message: "Market created successfully.",
      marketplace,
      sellers_market: marketsResult.rows,
    });
  } catch (error) {
    console.error("Create marketplace error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create marketplace.",
    });
  }
};

module.exports = { create_a_market };
