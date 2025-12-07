import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit:"19kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import authRoutes from "./src/routes/auth.routes.js";
import recruiterRoutes from"./src/routes/recruiter.routes.js"
import jobRoutes from "./src/routes/job.routes.js";
import applicantRoutes from "./src/routes/applicant.routes.js";
import applicationRoutes from "./src/routes/application.routes.js"
import interviewRoutes from "./src/routes/interview.routes.js";
import inngestRoutes from "./src/routes/inngest.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recruiter" , recruiterRoutes);
app.use("/api/v1/job" ,jobRoutes)
app.use("/api/v1/applicant" , applicantRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/interview", interviewRoutes);
app.use("/api/v1/notification", notificationRoutes);

// --- ADD THIS LINE ---
// Note: We do NOT add a path prefix here like "/api/v1" 
// because your route file already includes "/api/inngest"
app.use(inngestRoutes); 
// ---------------------

export {app}