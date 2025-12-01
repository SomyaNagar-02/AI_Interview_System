import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
// import dotenv from "dotenv";
// dotenv.config();

let gfsBucket;

// Create GridFS bucket when connection opens
mongoose.connection.once("open", () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "resumes"
  });
  console.log("GridFS bucket initialized");
});

const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  file: (req, file) => {
    return {
      filename: `${req.user._id}_${Date.now()}_${file.originalname}`,
      bucketName: "resumes"
    };
  }
});

export const uploadResumeMulter = multer({ storage });

export const getResumeStream = (id) =>
  gfsBucket.openDownloadStream(new mongoose.Types.ObjectId(id));
