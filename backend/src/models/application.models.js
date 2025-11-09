import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeUrl: String,
  atsScore: Number,
  atsResult: { type: String, enum: ["passed", "rejected", "pending"], default: "pending" },
  interviewStatus: { type: String, enum: ["not_scheduled", "scheduled", "completed"], default: "not_scheduled" },
  interviewDate: Date,
  interviewResult: { type: String, enum: ["selected", "rejected", "pending"], default: "pending" },
  feedback: String
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
