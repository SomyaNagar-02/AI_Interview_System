import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createApplicantProfile,
    getApplicantProfile,
    updateApplicantProfile,
    deleteApplicantProfile,
    uploadProfilePic,
} from "../controllers/applicant.controller.js";

import { uploadImage } from "../middlewares/uploadImage.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createApplicantProfile);
router.get("/me", verifyJWT, getApplicantProfile);
router.put("/edit", verifyJWT, updateApplicantProfile);
router.delete("/delete", verifyJWT, deleteApplicantProfile);
router.post("/upload-profile-pic", verifyJWT, uploadImage.single("image"), uploadProfilePic);

export default router;