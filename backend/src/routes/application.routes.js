import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadResumeMulter } from "../config/gridfs.js";
import { applyJob, viewResume } from "../controllers/application.controller.js";

const router = express.Router();

// Apply job (upload resume)
router.post(
  "/:jobId/apply",
  verifyJWT,
  uploadResumeMulter.single("resume"),
  applyJob
);

// View resume used in application
router.get("/resume/:fileId", verifyJWT, viewResume);

export default router;
