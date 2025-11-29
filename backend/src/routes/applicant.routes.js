import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createApplicantProfile,
    getApplicantProfile,
    editApplicantProfile,
    deleteApplicantProfile,
    uploadApplicantProfilePic
} from "../controllers/applicant.controller.js";

const router = express.Router();

router.post("/create", verifyJWT, createApplicantProfile);
router.get("/me", verifyJWT, getApplicantProfile);
router.put("/edit", verifyJWT, editApplicantProfile);
router.delete("/delete", verifyJWT, deleteApplicantProfile);
router.post("/upload-profile-pic", verifyJWT, uploadImage.single("image"), uploadApplicantProfilePic);

export default router;