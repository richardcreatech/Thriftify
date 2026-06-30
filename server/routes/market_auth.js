const express = require("express");
const market_routes = express.Router();
const { create_a_market } = require("../controller/market_creation");
const { authMiddle } = require("../middleware/authMiddle");
const { getMarketplaces } = require("../controller/get_markets");
const { delete_market } = require("../controller/delete_market");
const { getMarketInfo } = require("../controller/get_market_info");
const { createProduct } = require("../controller/createProduct");
const { edit_product } = require("../controller/editProduct");
const { delete_product } = require("../controller/deletProduct");

market_routes.get("/get_market", authMiddle, getMarketplaces);
market_routes.get("/market_info/:marketId", authMiddle, getMarketInfo);
market_routes.post("/make", authMiddle, create_a_market);
market_routes.post("/create_market/:marketId", authMiddle, createProduct);
market_routes.patch(
  "/edit_product/:marketId/product/:productId",
  authMiddle,
  edit_product,
);
market_routes.delete(
  "/delete_product/:marketId/product/:productId",
  authMiddle,
  delete_product
);
market_routes.delete("/delete_market/:marketId", authMiddle, delete_market);

module.exports = { market_routes };
