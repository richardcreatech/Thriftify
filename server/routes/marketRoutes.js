import express from "express";
import {
  getAllMarkets,
  getMarketProducts,
} from "../controllers/marketController.js";

const router = express.Router();

router.get("/", getAllMarkets);
router.get("/:marketId/products", getMarketProducts);

export default router;