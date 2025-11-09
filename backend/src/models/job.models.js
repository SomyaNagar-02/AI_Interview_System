import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  location: String,
  companyName: String,
  skillsRequired: [String],
  experienceRequired: String,
  salaryRange: String,
  jobType: { type: String, enum: ["full-time", "internship", "part-time"], default: "full-time" },
  atsCriteria: {
    keywords: [String],
    minScore: { type: Number, default: 50 }
  }
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
