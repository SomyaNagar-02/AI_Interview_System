import mongoose from "mongoose";
import Application from "../models/application.models.js";
import Applicant from "../models/applicant.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// FIX: Import the new helper function
import { getResumeStream, uploadToGridFS } from "../config/gridfs.js"; 

//==================== APPLY FOR JOB (APPLICANT) ====================
export const applyJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { jobId } = req.params;

  // 1. Check if file exists in memory
  if (!req.file) {
    throw new ApiError(400, "Resume upload required to apply");
  }

  // 2. Manually upload to GridFS and get the ID
  // Note: We await this because it's a database operation now
  const resumeId = await uploadToGridFS(req.file, userId);

  const application = await Application.create({
    jobId,
    applicantId: userId,
    resumeUrl: resumeId // Store the ID we just got
  });

  await Applicant.findOneAndUpdate(
    { userId },
    { $push: { appliedJobs: application._id } }
  );

  return res.status(201).json(
    new ApiResponse(201, application, "Applied successfully")
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

  res.setHeader(
    "Content-Disposition",
    `inline; filename="${file.filename}"`
  );
  res.setHeader("Content-Type", file.contentType || "application/pdf");

  const stream = getResumeStream(fileId);
  stream.pipe(res);
});