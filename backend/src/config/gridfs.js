import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

let gfsBucket;

mongoose.connection.once("open", () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "resumes"
  });
  console.log("GridFS bucket initialized");
});

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
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
