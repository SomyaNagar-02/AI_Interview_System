import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skills: [String],
  experience: String,
  education: String,
  projects: [String],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]
}, { timestamps: true });

export default mongoose.model("Applicant", applicantSchema);
