import multer from "multer";
//import { CloudinaryStorage } from "multer-storage-cloudinary";

// 1. Import default to handle CommonJS compatibility on Node 22+
import pkg from "multer-storage-cloudinary";
const { CloudinaryStorage } = pkg;
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pics",
    allowed_formats: ["jpg", "jpeg", "png"]
  }
});

export const uploadImage = multer({ storage });
