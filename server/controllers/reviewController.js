import pool from "../config/db.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `
      SELECT
        pr.id,
        pr.product_id,
        pr.rating,
        pr.comment,
        pr.created_at,
        u.name AS reviewer_name
      FROM product_reviews pr
      JOIN users u
        ON pr.user_id = u.id
      WHERE pr.product_id = $1
      ORDER BY pr.created_at DESC;
      `,
      [productId]
    );

    return res.status(200).json({
      message: "Product reviews fetched successfully!",
      reviews: result.rows,
    });

  } catch (error) {
    console.error("Fetch product reviews error:", error);

    return res.status(500).json({
      message: "Something went wrong while fetching product reviews.",
    });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // 1. Get the authenticated user's ID
    const userId = req.user.userId;

    // 2. Validate the product ID
    if (!/^[1-9]\d*$/.test(productId)) {
      return res.status(400).json({
        message: "Invalid product ID."
      });
    }

    // 3. Validate the rating
    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a whole number between 1 and 5."
      });
    }

    // 4. Validate the comment
    if (
      comment !== undefined &&
      comment !== null &&
      typeof comment !== "string"
    ) {
      return res.status(400).json({
        message: "Comment must be a valid text value."
      });
    }

    // 5. Check if the product exists
    const product = await pool.query(
      "SELECT id FROM products WHERE id = $1",
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found."
      });
    }

    // 6. Check if the user has already reviewed this product
    const existingReview = await pool.query(
      `SELECT id
       FROM product_reviews
       WHERE product_id = $1 AND user_id = $2`,
      [productId, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(409).json({
        message: "You have already reviewed this product."
      });
    }

    // 7. Save the review
    const result = await pool.query(
      `INSERT INTO product_reviews
       (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, product_id, rating, comment, created_at`,
      [
        productId,
        userId,
        rating,
        comment?.trim() || null
      ]
    );

    return res.status(201).json({
      message: "Product review submitted successfully!",
      review: result.rows[0]
    });

  } catch (error) {
    console.error("Create product review error:", error);

    return res.status(500).json({
      message: "Something went wrong while submitting your review."
    });
  }
};