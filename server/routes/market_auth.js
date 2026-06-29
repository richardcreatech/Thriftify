const express = require("express");
const market_routes = express.Router();
const { create_a_market } = require("../controller/market_creation");
const { authMiddle } = require("../middleware/authMiddle");
const { getMarketplaces } = require("../controller/get_markets");
const { delete_market } = require("../controller/delete_market");

market_routes.get("/get_market", authMiddle, getMarketplaces);
market_routes.post("/make", authMiddle, create_a_market);
market_routes.delete("/delete_market/:marketId", authMiddle, delete_market);

module.exports = { market_routes };