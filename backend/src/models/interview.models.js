import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
resumeText :String,
  interviewToken: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },

  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "failed"],
    default: "pending"
  },

  fullTranscript: String,
  durationSeconds: Number,

  conductedVia: {
    type: String,
    default: "vapi"
  },

  aiSummary: String,
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);
