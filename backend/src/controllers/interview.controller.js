import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Interview from "../models/interview.models.js";
import Job from "../models/job.models.js"; // Import Job model
import Application from "../models/application.models.js"
import { generateVapiJwt } from "../utils/vapiJwt.js";
import {GoogleGenAI} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
const model = ai.models.get({ model: "gemini-2.0-flash" });
export const getVapiJwt = async (req, res) => {
  const vapiJwt = generateVapiJwt();
  res.status(200).json({ vapiJwt });
};

// Check if token is valid and return context for AI
export const validateInterviewToken = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const interview = await Interview.findOne({ interviewToken: token });

  if (!interview) {
    throw new ApiError(404, "Invalid interview link");
  }

  if (new Date() > interview.expiresAt) {
    throw new ApiError(400, "Interview link expired");
  }

  if (interview.status === "completed") {
    throw new ApiError(403, "Interview already completed");
  }

  // ✅ Lock interview but allow re-entry if they refresh
  interview.status = "in_progress";
  await interview.save();


  const job = await Job.findById(interview.jobId)
    .select("title description skillsRequired");

  return res.status(200).json(
    new ApiResponse(200, {
      interviewId: interview._id,
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.skillsRequired,
      resumeText:interview.resumeText
    }, "Interview validated")
  );
});



// Save results after AI finishes (Webhook or Manual Save)
export const saveInterviewResult = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { transcript, durationSeconds } = req.body;
  
  // If no transcript was captured (e.g. user was silent or mic issue), don't fail the backend.
  const finalTranscript = transcript && transcript.trim() !== "" ? transcript : "No speech was detected during the interview.";

  const interview = await Interview.findOne({ interviewToken: token });
  console.log(transcript, interview);
  if (!interview) throw new ApiError(404, "Interview not found");

  if (interview.status === "completed") {
    throw new ApiError(400, "Interview already submitted");
  }

  const job= await Job.findById(interview.jobId);
  if(!job)throw new ApiError(404, "Associated job description not found")
let aiResponseData={
  summary:"Ai Evaluation failed.",
 score:0,
result:"pending"
}

try {
  const prompt=`
      Act as a Senior Technical Recruiter. Evaluate the following interview transcript for the role of "${job.title}".
      
      Job Description:
      ${job.description}
      
      Required Skills:
      ${job.skillsRequired.join(", ")}
      
      Candidate Transcript:
      "${finalTranscript}"
      
      Analyze the candidate's responses based on technical accuracy, communication skills, and relevance to the job description.
      
      You MUST return the output in valid JSON format with no markdown blocks. Structure:
      {
        "summary": "A concise 3-4 sentence professional summary of the interview performance.",
        "score": <number between 0-100>,
        "result": "<strictly 'selected' or 'rejected'>"
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.text;
    
    // Robust JSON extraction: look for the first '{' and last '}'
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResponseData = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No valid JSON found in AI response");
    }


  
} catch (error) {
  console.log("Ai result Evaluation Error:" , error)
}

console.log(finalTranscript)
  interview.fullTranscript = finalTranscript;
  interview.durationSeconds = durationSeconds;
  interview.aiSummary = aiResponseData.summary;
  interview.status = "completed";
  await interview.save();

  const finalResult = aiResponseData.result === "selected" ? "selected" : "rejected";

  await Application.findByIdAndUpdate(interview.applicationId, {
    aiScore: aiResponseData.score,
    interviewResult: finalResult,
    interviewStatus: "completed",
    feedback: aiResponseData.summary // Optionally sync summary to feedback
  });
  return res.status(200).json(
    new ApiResponse(200, {
      interviewId: interview._id,
      aiScore: aiResponseData.score,
      result: finalResult,
      summary: aiResponseData.summary
    }, "Interview saved and evaluated successfully")
  );
});

// ─── RECRUITER: Get all jobs that have at least one completed interview ───────
export const getRecruiterResultJobs = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  // Find all jobs posted by this recruiter
  const jobs = await Job.find({ recruiterId }).select("title companyName location jobType createdAt");

  if (!jobs.length) {
    return res.status(200).json(new ApiResponse(200, [], "No jobs found"));
  }

  const jobIds = jobs.map(j => j._id);

  // Find jobs that have at least one completed interview
  const completedInterviews = await Interview.find({
    jobId: { $in: jobIds },
    status: "completed"
  }).select("jobId");

  // Count completed interviews per job
  const countMap = {};
  completedInterviews.forEach(iv => {
    const id = iv.jobId.toString();
    countMap[id] = (countMap[id] || 0) + 1;
  });

  // Attach count to each job (only include jobs with results)
  const jobsWithResults = jobs
    .map(job => ({
      _id: job._id,
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      jobType: job.jobType,
      createdAt: job.createdAt,
      completedCount: countMap[job._id.toString()] || 0
    }))
    .filter(job => job.completedCount > 0);

  return res.status(200).json(new ApiResponse(200, jobsWithResults, "Jobs with results fetched"));
});

// ─── RECRUITER: Get all completed interview results for a specific job ────────
export const getResultsByJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const interviews = await Interview.find({ jobId, status: "completed" })
    .populate("applicantId", "name email")
    .select("applicantId aiSummary durationSeconds fullTranscript createdAt");

  // Join with Application to get score and result
  const results = await Promise.all(
    interviews.map(async (iv) => {
      const application = await Application.findOne({
        jobId,
        applicantId: iv.applicantId._id
      }).select("aiScore interviewResult atsScore");

      return {
        interviewId: iv._id,
        candidateName: iv.applicantId?.name || "Unknown",
        candidateEmail: iv.applicantId?.email || "—",
        aiScore: application?.aiScore ?? null,
        interviewResult: application?.interviewResult ?? "pending",
        atsScore: application?.atsScore ?? null,
        aiSummary: iv.aiSummary || "No summary available.",
        durationSeconds: iv.durationSeconds,
        completedAt: iv.createdAt,
      };
    })
  );

  // Sort by aiScore descending (best first)
  results.sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));

  return res.status(200).json(new ApiResponse(200, results, "Interview results fetched"));
});
