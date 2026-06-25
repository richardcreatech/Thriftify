const express = require("express");
const auth_routes = express.Router();
const {sign_in} = require("../controller/sign_in");;

auth_routes.post("/sign_in" , sign_in)

module.exports = { auth_routes };