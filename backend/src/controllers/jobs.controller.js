import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Job from "../models/job.models.js";
import Recruiter from "../models/recruiter.models.js";
import mongoose from "mongoose";
export const addJobs = asyncHandler(async (req, res) => {
  const {
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
  const userId =  req.user._id;
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
const recruiterId = req.user._id
  const recruiter = await Recruiter.findOne({ userId: recruiterId });

  if (!recruiter) {
    throw new ApiError(404, "user not found");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "job doesnt exist ");
  }

  if(job.recruiterId.toString()!==recruiterId.toString()){
    throw new ApiError(403 , "you are not allowred to edit this job")
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
  const recruiterId=req.user._id;
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "job not found");
  }
    if(job.recruiterId.toString()!==recruiterId.toString()){
    throw new ApiError(403 , "you are not allowred to edit this job")
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
  const recruiterId = req.user._id;
  if (!recruiterId) {
    throw new ApiError(404, "user id not found");
  }
  const jobs = await Job.find({ recruiterId: recruiterId });
  
  return res.status(200).json(new ApiResponse(200, jobs, "jobs fetched"))

});
//=============getalljobs==========

export const getAllJobsWithRecruiter =asyncHandler(async(req , res)=>{
  const page  = Math.max(1 , parseInt(req.query.page||"1"));
  const limit =Math.min(30 , parseInt(req.query.limit||"10"));
  const skip =(page-1)*limit;
  const match ={};
  if(req.query.location)match.location = req.query.location;
  if(req.query.jobType)match.jobType =req.query.jobType;
  if(req.query.search){
    match.$or=[
      {title:{$regex:text , $option:"i"}},
      {description:{$regex:text , $option:"i"}},
      {companyName:{$regex:text , $option:"i"}}
    ];
  }

  const pipeline=[
    {$match:match},
    {
      $lookup:{
        from:"recruiters",
        localField:"recruiterId",
        foreignField:"userId",
        as:"recruiterInfo",
      },
    },

{$unwind:{path:"$recruiterInfo" , preserveNullAndEmptyArrays:true}},
{
  $project:{
    title:1,
    description:1,
    location:1,
    skillsRequired:1,
    experienceRequired:1,
    salaryRange:1,
    jobType:1,
    atsCriteria:1,
     companyName: "$recruiterInfo.companyName",
    createdAt:1,
    updatedAt:1,
    recruiter:{
      _id:"$recruiterInfo._id",
      userId:"recruiterInfo.userId",
      companyName:"recruiterInfo.companyName",
      website:"$recuiterInfo.website"
    }
  }
},
{$sort:{createdAt:-1}},
{$skip:skip},
{$limit:limit}


  ]

  const jobs = await Job.aggregate(pipeline);
  const totalCount =await Job.countDocuments(match);
   return res
    .status(200)
    .json(new ApiResponse(200, { jobs, total: totalCount, page, limit }, "Jobs fetched"));
});


