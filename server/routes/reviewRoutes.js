  import express from "express";

import {
  getProductReviews,
  createProductReview
} from "../controllers/reviewController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:productId", getProductReviews);

router.post(
  "/:productId",
  authenticateToken,
  createProductReview
);

export default router;
