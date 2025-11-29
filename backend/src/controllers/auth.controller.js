import User from '../models/user.models.js';
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  assignTokens,
  verifyRefreshToken,
  revokeRefreshToken
} from "../services/token.service.js";

//====================== REGISTER ======================
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body; 

    //Validate required fields
    if([name, email, password, role].some((field) => field?.trim() === "")){ 
        throw new ApiError(400, "All fields are required")
    }

    //Check for existing user 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already exists")
    }

    //Create new user
    const newUser = await User.create({ 
        name, 
        email, 
        password,
        role
    });
    
    // Prepare safe response (excluding password and refresh token)
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.")
    }

    const { accessToken, refreshToken } = await assignTokens(newUser._id);

    return res
    .status(201)
    .cookie("accessToken", accessToken, { httpOnly: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true })
    .json(new ApiResponse(201, { user: createdUser, accessToken, refreshToken}, "User registered successfully"))

  }
  catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server Error" });
}
});

// ====================== LOGIN ======================
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await assignTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true })
    .json(new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful"));
});


// ====================== REFRESH TOKEN ======================
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new ApiError(401, "Refresh token missing");

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(404, "User not found");

  const { accessToken } = await assignTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true })
    .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

// ====================== LOGOUT ======================
export const logoutUser = asyncHandler(async (req, res) => {
  await revokeRefreshToken(req.user._id);

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});