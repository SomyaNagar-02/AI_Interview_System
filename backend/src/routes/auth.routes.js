import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyJWT, logoutUser);

export default router;