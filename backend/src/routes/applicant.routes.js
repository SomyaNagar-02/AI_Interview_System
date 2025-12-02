import express from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createApplicantProfile,
    getApplicantProfile,
    updateApplicantProfile,
    deleteApplicantProfile,
    uploadProfilePic,
} from "../controllers/applicant.controller.js";

import { uploadImage } from "../middlewares/uploadImage.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, authorizeRoles("applicant"), createApplicantProfile);
router.get("/me", verifyJWT, authorizeRoles("applicant"), getApplicantProfile);
router.put("/edit", verifyJWT, authorizeRoles("applicant"), updateApplicantProfile);
router.delete("/delete", verifyJWT, authorizeRoles("applicant"), deleteApplicantProfile);
router.post("/upload-profile-pic", verifyJWT, authorizeRoles("applicant"), uploadImage.single("image"), uploadProfilePic);

export default router;