import express from 'express';
const router = express.Router();
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {getAllJobs} from '../controllers/jobs.controller.js';
import { addJobs , editJob , deleteJob ,getAllJobsWithRecruiter} from '../controllers/jobs.controller.js';
router.post("/addJob" , verifyJWT ,addJobs );
router.put("/updateJob" , verifyJWT , editJob);
router.delete("/deleteJob/:jobId" , verifyJWT , deleteJob);
router.get("/getJobs/:recruiterId" , verifyJWT , getAllJobs);
// jobs.route.js
router.get("/allWithRecruiter", getAllJobsWithRecruiter); // public or protected as you need

export default router;