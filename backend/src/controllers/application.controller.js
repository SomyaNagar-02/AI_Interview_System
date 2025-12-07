import mongoose from "mongoose";

import Application from "../models/application.models.js";
import Applicant from "../models/applicant.models.js";
import Job from "../models/job.models.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// FIX: Import the new helper function
import { getResumeStream, uploadToGridFS } from "../config/gridfs.js";
import { inngest } from "../inngest/client.js";

//==================== APPLY FOR JOB (APPLICANT) ====================
export const applyJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { jobId } = req.params;

  // 1. Check if file exists in memory
  if (!req.file) {
    throw new ApiError(400, "Resume upload required to apply");
  }

  const job = await Job.findById(jobId);
  if (!job) throw new ApiError(404, "Job not found");

  // 2. Manually upload to GridFS and get the ID
  // Note: We await this because it's a database operation now
  const resumeId = await uploadToGridFS(req.file, userId);

  // 3. Create Application
  const application = await Application.create({
    jobId,
    applicantId: userId,
    resumeUrl: resumeId, // Store the ID we just got
  });

  // 4. Link Application to Applicant Profile
  const applicant = await Applicant.findOneAndUpdate(
    { userId },
    { $push: { appliedJobs: application._id } }
  );

  // 5. TRIGGER INNGEST (Fire and Forget)
  // This starts the background email & AI process
  await inngest.send({
    name: "application/submitted",
    data: {
      userId: userId,
      jobId: jobId,
      jobTitle: job.title,
      resumeId: resumeId
    },
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        application,
        "Applied successfully & Notification sent"
      )
    );
});

//==================== VIEW RESUME (RECRUITER) ====================
// (This function stays mostly the same, just keep it for context)
export const viewResume = asyncHandler(async (req, res) => {
  const fileId = req.params.fileId;

  const file = await mongoose.connection.db
    .collection("resumes.files")
    .findOne({ _id: new mongoose.Types.ObjectId(fileId) });

  if (!file) return res.status(404).send("File not found");

  res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);
  res.setHeader("Content-Type", file.contentType || "application/pdf");

  const stream = getResumeStream(fileId);
  stream.pipe(res);
});
