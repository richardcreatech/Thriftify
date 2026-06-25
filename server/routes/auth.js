const express = require("express");
const auth_routes = express.Router();
const { sign_in } = require("../controller/sign_in");
const { get_seller_profile } = require("../controller/get_seller_profile");
const { authMiddle } = require("../middleware/authMiddle");

auth_routes.post("/sign_in", sign_in);
auth_routes.get("/get_seller_profile", authMiddle, get_seller_profile);

module.exports = { auth_routes };
