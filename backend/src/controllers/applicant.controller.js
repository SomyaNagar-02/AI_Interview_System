import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import User from "../models/user.models.js";
import Applicant from "../models/applicant.models.js";

//==================== Create Applicant Profile ====================
export const createApplicantProfile = asyncHandler(async (req, res) => {
  const { skills, experience, education, projects, location, country, dob, summary, linkedin } = req.body;
  const userId = req.user._id;
  
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if(user.role.toLowerCase() === "recruiter") {
    throw new ApiError(403, "Recruiters cannot create applicant profiles");
  }

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
    location,
    country,
    dob,
    summary,
    linkedin
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

  // 1. Get immutable Auth info (Name, Email)
  const user = await User.findById(userId).select("name email profilePic");

  // 2. Get mutable Profile info
  const applicantProfile = await Applicant.findOne({ userId });

  // 3. Combine them
  const responseData = {
    // Auth Data (Read Only)
    name: user.name,
    email: user.email,

    //Added profilePic here so the frontend receives it
    profilePic: user.profilePic || "",

    // Profile Data (Editable)
    // If profile exists, use it. If not, return empty strings.
    location: applicantProfile?.location || "",
    country: applicantProfile?.country || "",
    dob: applicantProfile?.dob || "",
    profilePic: user.profilePic || "",
    skills: applicantProfile?.skills || [],
    experience: applicantProfile?.experience || "",
    education: applicantProfile?.education || "",
    projects: applicantProfile?.projects || [],
    summary: applicantProfile?.summary || "",
    linkedin: applicantProfile?.linkedin || ""
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Applicant profile fetched successfully")
    );
});

//==================== Update Applicant Profile ====================
export const updateApplicantProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Filter: Only extract fields allowed to be updated
  const { skills, experience, education, projects, location, country, dob, summary, linkedin } = req.body;

  // 2. Validation: Check if request is empty
  const updateData = {};
  if (location) updateData.location = location;
  if (country) updateData.country = country;
  if (dob) updateData.dob = dob;

  if (skills) updateData.skills = skills;
  if (experience) updateData.experience = experience;
  if (education) updateData.education = education;
  if (projects) updateData.projects = projects;
  if (summary) updateData.summary = summary;
  if (linkedin) updateData.linkedin = linkedin;
  
  // Remove undefined keys to check true emptiness
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No data provided for update");
  }

  // 3. Database Operation (Upsert)
  // Update if exists, Create if it doesn't.
  const updatedProfile = await Applicant.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (!updatedProfile) {
    throw new ApiError(500, "Error in updating applicant profile");
  }

  // 4. Ensure User 'hasProfile' flag is true (in case this was a first-time save)
  if (!req.user.hasProfile) {
    await User.findByIdAndUpdate(userId, { hasProfile: true });
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
