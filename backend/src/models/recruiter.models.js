import mongoose from "mongoose";

const recruiterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  description: String,
  website: String,
  postedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
}, { timestamps: true });

export default mongoose.model("Recruiter", recruiterSchema);
