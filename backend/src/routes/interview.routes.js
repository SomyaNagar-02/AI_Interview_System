import express from "express";
import { validateInterviewToken, saveInterviewResult } from "../controllers/interview.controller.js";

const router = express.Router();

// Public route (because the token IS the authentication)
// The user clicks the link from email, they might not be logged in to the platform
router.get("/validate/:token", validateInterviewToken);

// Save result
router.post("/complete/:token", saveInterviewResult);

export default router;