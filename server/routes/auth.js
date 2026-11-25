const express = require("express");
const auth_routes = express.Router();
const { sign_in } = require("../controller/sign_in");
const { get_seller_profile } = require("../controller/get_seller_profile");
const { authMiddle } = require("../middleware/authMiddle");
const { register_user, register } = require("../controller/registerUser");
const { verifyOtp } = require("../controller/my_otp");
const { verify } = require("../middleware/verify");
const { set_a_password } = require("../controller/set_a_password");
const { set_name } = require("../controller/set_name");
const { set_username } = require("../controller/set_username");
const { uploadProfilePicture } = require("../controller/upload_profile");
const {
  requestProfileEditVerification,
  confirmProfileEdit,
} = require("../controller/edit_profile");
const { upload } = require("../middleware/uploads");

auth_routes.post("/register", register);
auth_routes.post("/token", verify, verifyOtp);
auth_routes.patch("/password", verify, set_a_password);
auth_routes.patch("/set_name", verify, set_name);
auth_routes.patch("/set_user", verify, set_username);
auth_routes.patch("/pic", verify, upload.single("image"), uploadProfilePicture);
auth_routes.post(
  "/profile/edit/request-verification",
  authMiddle,
  requestProfileEditVerification
);
auth_routes.post(
  "/profile/edit/confirm",
  authMiddle,
  upload.single("image"),
  confirmProfileEdit
);
auth_routes.post("/sign_in", sign_in);
auth_routes.get("/get_seller_profile", authMiddle, get_seller_profile);

module.exports = { auth_routes };
