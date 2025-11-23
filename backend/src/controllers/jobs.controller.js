import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Job from "../models/job.models.js";
import Recruiter from "../models/recruiter.models.js";
export const addJobs = asyncHandler(async (req, res) => {
  const {
    userId,
    title,
    description,
    location,
    companyName,
    skillsRequired,
    experienceRequired,
    salaryRange,
    jobType,
    atsCriteria,
  } = req.body;
  if (!userId || !title) {
    throw new ApiError(400, "recruiter or title  not found ");
  }

  const recruiter = await Recruiter.findOne({ userId: userId });
  if (!recruiter) {
    throw new ApiError(404, "user not found");
  }

  const newJob = await Job.create({
    recruiterId: userId,
    title,
    description,
    location,
    companyName,
    skillsRequired,
    experienceRequired,
    salaryRange,
    jobType,
    atsCriteria,
  });

  if (!newJob) {
    throw new ApiError(500, "error saving job profile");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newJob, "job profile succesfully created "));
});
//===============edit job --(rework,  abhi kaam karna hai)
export const editJob = asyncHandler(async (req, res) => {
  const {
    jobId,
    recruiterId,
    title,
    description,
    location,
    companyName,
    skillsRequired,
    experienceRequired,
    salaryRange,
    jobType,
    atsCriteria,
  } = req.body;

  const recruiter = await Recruiter.findOne({ userId: recruiterId });

  if (!recruiter) {
    throw new ApiError(404, "user not found");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "job doesnt exist ");
  }

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (location) updateData.location = location;
  if (companyName) updateData.companyName = companyName;
  if (skillsRequired) updateData.skillsRequired = skillsRequired;
  if (experienceRequired) updateData.experienceRequired = experienceRequired;
  if (salaryRange) updateData.salaryRange = salaryRange;
  if (jobType) updateData.jobType = jobType;
  if (atsCriteria) updateData.atsCriteria = atsCriteria;
  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $set: updateData },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, updatedJob, "job updated"));
});
//====================deleted job ================

export const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    throw new ApiError(404, "job id not found");
  }
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "job not found");
  }
  console.log(job);

  const isDeleted = await Job.deleteOne({ _id: jobId });
  if (isDeleted.deletedCount === 0) {
    throw new ApiError(500, "something wen twrong in deleting the data");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "job profile deleted"));
});
//==============GET JOBS===========

export  const getAllJobs = asyncHandler(async (req, res) => {
  const { recruiterId } = req.params;
  if (!recruiterId) {
    throw new ApiError(404, "user id not found");
  }
  const jobs = await Job.find({ recruiterId: recruiterId });
  
  return res.status(200).json(new ApiResponse(200, jobs, "jobs fetched"))

});


