import express from 'express'
import { verifyJWT , authorizeRoles } from '../middlewares/auth.middleware.js'
import { setRecruiterDetails  ,getRecruiterProfile ,editProfile ,deleteProfile, getAllAppliedcandidate} from '../controllers/recruiter.controller.js'
const router = express.Router()

router.post("/setRecruiterDetails" , verifyJWT ,authorizeRoles("recruiter") ,setRecruiterDetails )
router.get("/getRecruiterDetails" , verifyJWT ,authorizeRoles("recruiter") ,getRecruiterProfile )
router.put("/editRecruiter" , verifyJWT,authorizeRoles("recruiter") , editProfile);
router.delete("/deleteProfile" , verifyJWT,authorizeRoles("recruiter") ,deleteProfile)
router.get("/getAppliedCand" , verifyJWT,authorizeRoles("recruiter") , getAllAppliedcandidate)
export default router; 
