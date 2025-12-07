import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Interview from "../models/interview.models.js";
import Job from "../models/job.models.js"; // Import Job model

// Check if token is valid and return context for AI
export const validateInterviewToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const interview = await Interview.findOne({ interviewToken: token });

  if (!interview) {
    throw new ApiError(404, "Invalid interview link");
  }

  if (interview.status !== "pending") {
    throw new ApiError(400, "This interview has already been completed or expired");
  }

  if (new Date() > interview.expiresAt) {
    throw new ApiError(400, "This interview link has expired");
  }

  // Fetch Job Details to give context to the AI
  const job = await Job.findById(interview.jobId).select("title description skillsRequired");

  return res.status(200).json(
    new ApiResponse(200, { 
      interviewId: interview._id,
      applicantName: req.user?.name || "Candidate", // Optional if user logged in
      jobTitle: job.title,
      jobDescription: job.description,
      skills: job.skillsRequired
    }, "Interview session valid")
  );
});

// Save results after AI finishes (Webhook or Manual Save)
export const saveInterviewResult = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { sections, totalScore } = req.body; // Data sent from Frontend/AI

    const interview = await Interview.findOneAndUpdate(
        { interviewToken: token },
        { 
            status: "completed",
            sections: sections,
            totalScore: totalScore
        },
        { new: true }
    );

    if (!interview) throw new ApiError(404, "Interview not found");

    return res.status(200).json(new ApiResponse(200, interview, "Interview saved"));
});