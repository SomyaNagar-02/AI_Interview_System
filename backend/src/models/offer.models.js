import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
  offerLetterUrl: String,
  message: String,
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["sent", "accepted", "declined"], default: "sent" }
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
