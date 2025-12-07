import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  // --- Fields needed for Scheduling/Link ---
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  
  status: { 
    type: String, 
    enum: ["pending", "in_progress", "completed", "failed"], 
    default: "pending" 
  },
  
  interviewToken: { type: String, required: true, unique: true }, // The Secret Link
  expiresAt: { type: Date, required: true },

  // --- Your Fields for storing Results later ---
  sections: {
    nonCoding: [{
      question: String,
      candidateResponse: String,
      aiScore: Number
    }],
    coding: [{
      question: String,
      codeSubmitted: String,
      testCasesPassed: Number,
      totalTestCases: Number,
      aiFeedback: String
    }]
  },
  totalScore: { type: Number, default: 0 },
  
  // Storing the initial ATS score here is also helpful
  atsScore: Number 
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);