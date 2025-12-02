import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // --- Personal Details (Moved here) ---
  location: { type: String },      // City, State
  country: { type: String },
  dob: { type: String },           // Date of Birth
  // -------------------------------------

  // --- Professional Details ---
  skills: [String],
  experience: String,
  education: String,
  projects: [String],

  // --- New Fields ---
  summary: { type: String },      // "Short professional summary"
  linkedin: { type: String },     // LinkedIn URL
  
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]
}, { timestamps: true });

export default mongoose.model("Applicant", applicantSchema);
