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


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/recruiter" , recruiterRoutes);
app.use("/api/v1/job" ,jobRoutes)

export {app}