import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Recruiter from "../models/recruiter.models.js";
import User from "../models/user.models.js";
import Application from "../models/application.models.js"
import Applicant from "../models/applicant.models.js"
//================setting up recruiter details =============
export const setRecruiterDetails = asyncHandler(async (req, res) => {
  const {  companyName, description, website } = req.body;
  const userId =  req.user._id;
  if (!userId || !companyName) {
    throw new ApiError(404, "user id or companyname not found ");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const existing = await Recruiter.findOne({ userId });
  if (existing) {
    throw new ApiError(400, "Recruiter profile already exists for this user");
  }

  const newRecruiter = await Recruiter.create({
    userId,
    companyName,
    description,
    website,
  });

  if (!newRecruiter) {
    throw new ApiError(500, "error in saving the data");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newRecruiter, "detail saved"));
});
//============getting up receuiter detail==============
export const getRecruiterProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new ApiError(400, "user id not found");
  }
  //since recruiter model taking the reference of  user model , we will use findOne not findById
  const recruiterDetail = await Recruiter.findOne({ userId });
  if (!recruiterDetail) {
    throw new ApiError(404, "recruiter doesnt exist");
  }
 
  return res
    .status(200)
    .json(new ApiResponse(200, recruiterDetail, " profile fetched"));
});

//===========delete profile ==================
export const deleteProfile = asyncHandler(async (req, res) => {
  const userId =  req.user._id;
  if (!userId) {
    throw new ApiError(404, "Userid not found in the request");
  }

  const recruiterDetail = await Recruiter.findOne({ userId });
  if (!recruiterDetail) {
    throw new ApiError(
      404,
      "user Doesnt exist , please share the correct userId"
    );
  }
   
  const isDeleted = await Recruiter.deleteOne({ userId });
  if (isDeleted.deletedCount === 0) {
    throw new ApiError(
      500,
      "something went wrong , when deleting the Recruiter , Recruiter not deleted"
    );
  }

  return res.status(200).json(new ApiResponse(200, null, "user deleted"));
});
//==============Edit Profile function===================
export const editProfile = asyncHandler(async (req, res) => {
  const { companyName, description, website } = req.body;
const userId=req.user._id;
  const recruiter = await Recruiter.findOne({ userId });
  if (!recruiter) {
    throw new ApiError(404, "recruiter not found");
  }
  const updateData = {};
  if (companyName) updateData.companyName = companyName;
  if (description) updateData.description = description;
  if (website) updateData.website = website;
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No feilds Provided to update");
  }

  const updatedRecruiter = await Recruiter.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true } //this will help in returning the updated doc
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedRecruiter, "Recruiter Profile Updated"));
});
//========getall appplied candidate for a job


export const getAllAppliedcandidate = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const {
    jobId,
    atsResult,
    interviewStatus,
    interviewResult,
    minAtsScore,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  // Pagination + Sort
  const skip = (page - 1) * limit;
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  // ============================
  // JOB FILTER
  // ============================
  const jobMatch = { recruiterId };

  if (jobId) {
    jobMatch._id = new mongoose.Types.ObjectId(jobId);
  }

  // ============================
  // APPLICATION FILTERS
  // ============================
  const applicationMatch = [];

  if (atsResult)
    applicationMatch.push({ $eq: ["$$app.atsResult", atsResult] });

  if (interviewStatus)
    applicationMatch.push({ $eq: ["$$app.interviewStatus", interviewStatus] });

  if (interviewResult)
    applicationMatch.push({ $eq: ["$$app.interviewResult", interviewResult] });

  if (minAtsScore)
    applicationMatch.push({ $gte: ["$$app.atsScore", Number(minAtsScore)] });

  const filterCondition =
    applicationMatch.length > 0 ? { $and: applicationMatch } : true;

  // ============================
  // PIPELINE
  // ============================
  const pipeline = [
    // 1️⃣ Filter jobs belonging to this recruiter
    { $match: jobMatch },

    // 2️⃣ Bring applications for each job
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "jobId",
        as: "applications"
      }
    },

    // 3️⃣ Apply filters to applications
    {
      $addFields: {
        applications: {
          $filter: {
            input: "$applications",
            as: "app",
            cond: filterCondition
          }
        }
      }
    },

    // 4️⃣ Get applicant user info
    {
      $lookup: {
        from: "users",
        localField: "applications.applicantId",
        foreignField: "_id",
        as: "userList"
      }
    },

    // 5️⃣ Get applicant profile info
    {
      $lookup: {
        from: "applicants",
        localField: "applications.applicantId",
        foreignField: "userId",
        as: "profileList"
      }
    },

    // 6️⃣ Merge application + user + profile
    {
      $addFields: {
        applicants: {
          $map: {
            input: "$applications",
            as: "app",
            in: {
              applicationId: "$$app._id",
              resumeUrl: "$$app.resumeUrl",
              atsScore: "$$app.atsScore",
              atsResult: "$$app.atsResult",
              interviewStatus: "$$app.interviewStatus",
              interviewDate: "$$app.interviewDate",
              interviewResult: "$$app.interviewResult",
              feedback: "$$app.feedback",

              user: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$userList",
                      cond: { $eq: ["$$this._id", "$$app.applicantId"] }
                    }
                  },
                  0
                ]
              },

              profile: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$profileList",
                      cond: { $eq: ["$$this.userId", "$$app.applicantId"] }
                    }
                  },
                  0
                ]
              }
            }
          }
        }
      }
    },

    // 7️⃣ Cleanup unnecessary arrays
    {
      $project: {
        applications: 0,
        userList: 0,
        profileList: 0
      }
    },

    // 8️⃣ Sorting
    { $sort: { [sortBy]: sortDirection } },

    // 9️⃣ Pagination
    { $skip: skip },
    { $limit: Number(limit) }
  ];

  const result = await Job.aggregate(pipeline);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "All applied candidates fetched successfully"));
});
