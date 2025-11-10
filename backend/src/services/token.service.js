import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

// 1️⃣ Assign tokens to a user (used during login/register)
export const assignTokens = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  // Save refresh token in DB so we can verify later (optional but secure)
  await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });

  return { accessToken, refreshToken };
};

// 2️⃣ Verify Access Token (used in middleware)
export const verifyAccessToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

// 3️⃣ Verify Refresh Token (used in refresh route)
export const verifyRefreshToken = (token) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

// 4️⃣ Revoke Refresh Token (used in logout route)
export const revokeRefreshToken = async (userId) => await User.findByIdAndUpdate(userId, { refreshToken: null });

