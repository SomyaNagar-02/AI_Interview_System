import express from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { setRecruiterDetails  ,getRecruiterProfile ,editProfile ,deleteProfile} from '../controllers/recruiter.controller.js'
const router = express.Router()

router.post("/setRecruiterDetails" , verifyJWT , setRecruiterDetails )
router.get("/getRecruiterDetails/:userId" , verifyJWT , getRecruiterProfile )
router.put("/editRecruiter" , verifyJWT , editProfile);
router.delete("/deleteProfile" , verifyJWT ,deleteProfile)
export default router;
