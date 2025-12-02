import "dotenv/config";
import mongoose from "mongoose";
import multer from "multer";
import { Readable } from "stream";

let gfsBucket;

// Initialize GridFS Bucket
mongoose.connection.once("open", () => {
  if (mongoose.connection.db) {
    gfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "resumes",
    });
    console.log("GridFS bucket initialized");
  }
});

// 1. CONFIG: Use Memory Storage (Keep file in RAM briefly)
const storage = multer.memoryStorage();
export const uploadResumeMulter = multer({ storage });

// 2. HELPER: Manual Upload Function
export const uploadToGridFS = (file, userId) => {
  return new Promise((resolve, reject) => {
    if (!gfsBucket) {
      return reject(new Error("GridFS Bucket not initialized"));
    }

    const filename = `${userId}_${Date.now()}_${file.originalname}`;
    
    // Create an upload stream to MongoDB
    const uploadStream = gfsBucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: { userId: userId } 
    });

    // FIX: The ID is available on the stream object immediately
    const fileId = uploadStream.id;

    // Convert buffer to stream and pipe to MongoDB
    const readStream = Readable.from(file.buffer);
    readStream.pipe(uploadStream)
      .on("error", (error) => reject(error))
      .on("finish", (record) => {
        // 'record' contains the file metadata, including _id
        resolve(fileId); 
      });
  });
};

// 3. HELPER: Download Stream (Same as before)
export const getResumeStream = (id) => {
  if (!gfsBucket) throw new Error("GridFS Bucket not initialized");
  return gfsBucket.openDownloadStream(new mongoose.Types.ObjectId(id));
};