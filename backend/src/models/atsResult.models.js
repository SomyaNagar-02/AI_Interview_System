import mongoose from "mongoose";

const atsResultSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  matchedKeywords: [String],
  missingKeywords: [String],
  overallScore: Number
}, { timestamps: true });

export default mongoose.model("ATSResult", atsResultSchema);
