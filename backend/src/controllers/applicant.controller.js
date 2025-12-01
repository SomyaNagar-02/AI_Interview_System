import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import User from "../models/user.models.js";
import Applicant from "../models/applicant.models.js";

//==================== Create Applicant Profile ====================
export const createApplicantProfile = asyncHandler(async (req, res) => {
  const { skills, experience, education, projects } = req.body;
  const userId = req.user._id;
  
  const user = await User.findById(userId);
  if(user.role.toLowerCase()==="recruiter")throw new ApiError(404 , "user is a recruiter")
  if (!user) throw new ApiError(404, "User not found");

  const existingProfile = await Applicant.findOne({ userId });
  if (existingProfile) {
    throw new ApiError(400, "Applicant profile already exists");
  }

  const newApplicantProfile = await Applicant.create({
    userId,
    skills,
    experience,
    education,
    projects,
  });

  if (!newApplicantProfile) {
    throw new ApiError(500, "Error in creating applicant profile");
  }

  // Update user to indicate profile created
  user.hasProfile = true;
  await user.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newApplicantProfile,
        "Applicant profile created successfully"
      )
    );
});

//==================== Get Applicant Profile ====================
export const getApplicantProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const profile = await Applicant.findOne({ userId });
  if (!profile) {
    throw new ApiError(404, "Applicant profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, profile, "Applicant profile fetched successfully")
    );
});

//==================== Update Applicant Profile ====================
export const updateApplicantProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { skills, experience, education, projects } = req.body;

  const updateData = {};
  if (skills) updateData.skills = skills;
  if (experience) updateData.experience = experience;
  if (education) updateData.education = education;
  if (projects) updateData.projects = projects;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No data provided for update");
  }

  const updatedProfile = await Applicant.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true }
  );

  if (!updatedProfile) {
    throw new ApiError(500, "Error in updating applicant profile");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProfile,
        "Applicant profile updated successfully"
      )
    );
});

//==================== Delete Applicant Profile ====================
export const deleteApplicantProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const deletedProfile = await Applicant.findOne({ userId });
  if (!deletedProfile) {
    throw new ApiError(404, "Applicant profile not found");
  }

  // Delete the applicant profile
  await Applicant.deleteOne({ userId });

  // Update user to indicate no profile exists now
  await User.findByIdAndUpdate(userId, { hasProfile: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Applicant profile deleted"));
});

//==================== UPLOAD PROFILE PIC ====================
export const uploadProfilePic = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    if(!req.file?.path){
        throw new ApiError(400, "File upload failed");
    }

    const imageUrl = req.file.path;

    await User.findByIdAndUpdate(userId, { profilePic: imageUrl }, { new: true });

    return res
        .status(200)
        .json(
            new ApiResponse(200, { profilePic: imageUrl }, "Profile picture updated successfully")
        );
});
