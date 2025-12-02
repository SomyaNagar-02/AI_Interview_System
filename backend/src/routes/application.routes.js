import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { uploadResumeMulter } from "../config/gridfs.js";
import { applyJob, viewResume } from "../controllers/application.controller.js";

const router = express.Router();

// Apply job (upload resume)
router.post(
  "/:jobId/apply",
  verifyJWT,
  authorizeRoles("applicant"),
  uploadResumeMulter.single("resume"),
  applyJob
);

// View resume used in application
router.get("/resume/:fileId", verifyJWT, authorizeRoles("applicant", "recruiter"), viewResume);

export default router;
