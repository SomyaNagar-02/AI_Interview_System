import express from "express";
import { validateInterviewToken, getVapiJwt, saveInterviewResult, getResultsByJob, getRecruiterResultJobs } from "../controllers/interview.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route (because the token IS the authentication)
router.get("/validate/:token", validateInterviewToken);

// Save result
router.post("/complete/:token", saveInterviewResult);
router.get("/vapi-jwt", getVapiJwt);

// Recruiter: get all jobs that have completed interviews
router.get("/recruiter/result-jobs", verifyJWT, getRecruiterResultJobs);

// Recruiter: get all interview results for a specific job
router.get("/results/:jobId", verifyJWT, getResultsByJob);

export default router;