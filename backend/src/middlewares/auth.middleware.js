import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../services/token.service.js";
import User from "../models/user.models.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =

      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodeToken = verifyAccessToken(token);

    const user = await User.findById(decodeToken?.id) //this _id is token id not mondoDB data id
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message ||
        "Invalid Access Token"
    )
  }
});

// Generic Role Checker
export const authorizeRoles = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    // 1. Check if user is logged in (verifyJWT should run before this)
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }

    // 2. Check if the user's role is in the allowed list
    // (We convert to lowercase just to be safe)
    if (!allowedRoles.includes(req.user.role.toLowerCase())) {
        throw new ApiError(403, "Access Denied: You do not have permission to access this resource");
    }

    next();
  });
};
