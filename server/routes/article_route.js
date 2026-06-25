const express = require("express");
const article_routes = express.Router();
const { get_all_articles } = require("../controller/get_all");

article_routes.get("/get_all_articles", get_all_articles);

module.exports = { article_routes };