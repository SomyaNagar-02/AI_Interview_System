import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
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
  totalScore: Number,
  status: { type: String, enum: ["in_progress", "completed"], default: "in_progress" }
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);
