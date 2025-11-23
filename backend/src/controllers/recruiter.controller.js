import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Recruiter from "../models/recruiter.models.js";
import User from "../models/user.models.js";

//================setting up recruiter details =============
export const setRecruiterDetails = asyncHandler(async (req, res) => {
  const { userId, companyName, description, website } = req.body;
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
  const { userId } = req.params;
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
  const { userId } = req.body;
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
  const { userId, companyName, description, website } = req.body;

  const recruiter = Recruiter.findOne({ userId });
  if (!recruiter) {
    throw new ApiError(404, "recruiter not found");
  }
  const updateData = {};
  if (companyName) updateData.companyName = companyName;
  if (description) updateData.description = description;
  if (website) updateData.description = website;
  if (Object.keys(updateData) === 0) {
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
