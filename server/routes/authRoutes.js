import express from "express";

import {
  register,
  login,
  getMe,
  updateProfile,
  requestEmailChange,
  confirmEmailChange
} from "../controllers/authController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", authenticateToken, getMe);
router.put("/profile", authenticateToken, updateProfile);
router.post("/email-change", authenticateToken, requestEmailChange);
router.post("/email-change/confirm", authenticateToken, confirmEmailChange);

export default router;
