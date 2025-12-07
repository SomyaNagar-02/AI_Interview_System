import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js"; // Your auth middleware
import { getUserNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";

const router = Router();

// 1. Apply Authentication (Must be logged in)
router.use(verifyJWT); 

// 2. Apply Authorization (Must be an Applicant OR a Recruiter)
// This prevents random admins or other future roles from seeing this if you don't want them to.
router.use(authorizeRoles("applicant", "recruiter"));

router.get("/", getUserNotifications);
router.patch("/:id/read", markNotificationAsRead);

export default router;