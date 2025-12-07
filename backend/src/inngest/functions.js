import { inngest } from "./client.js";
import { sendEmail } from "../utils/sendEmail.js";
import { extractTextFromResume } from "../utils/resumeParser.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";

// Models
import Notification from "../models/notification.models.js";
import Application from "../models/application.models.js";
import Job from "../models/job.models.js";
import User from "../models/user.models.js";
import Interview from "../models/interview.models.js";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const processApplication = inngest.createFunction(
  { id: "process-application" },
  { event: "application/submitted" },
  async ({ event, step }) => {
    const { userId, jobId, jobTitle, resumeId } = event.data;

    // STEP 1: Fetch Data
    const { user, job } = await step.run("fetch-data", async () => {
      const user = await User.findById(userId).select("email name");
      // Ensure we get companyName (falling back to SelectX if missing)
      const job = await Job.findById(jobId).select(
        "description title companyName"
      );
      return { user, job };
    });

    // STEP 2: Instant Receipt Notification
    await step.run("notify-receipt", async () => {
      const companyName = job.companyName || "SelectX";

      // Create In-App Notification (Using your schema fields)
      await Notification.create({
        recipient: userId,
        message: `You have successfully applied for the position of ${job.title} at ${companyName}.`,

        type: "application_received",
        relatedJob: jobId,
      });

      // Send Email
      const subject = `Application Received: ${job.title} at ${companyName}`;
      const body = `Dear ${user.name},

Thank you for your interest in the ${job.title} position at ${companyName}. 

We have successfully received your application and resume. Our recruitment team (powered by SelectX) is currently reviewing your qualifications against our requirements for this role.

What happens next?
We will be assessing your profile shortly. If your skills and experience are a strong match for the position, you will receive a notification regarding the next steps, which may include an AI-driven interview round.

Thank you for taking the time to apply.

Best regards,
The SelectX Recruitment Team
${companyName}`;

      await sendEmail(user.email, subject, body);
    });

    // STEP 3: Extract Text
    const resumeText = await step.run("extract-resume-text", async () => {
      return await extractTextFromResume(resumeId);
    });

    // STEP 4: AI Analysis
    const atsResult = await step.run("analyze-with-ai", async () => {
      // Use the model we confirmed works for you
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); 

      const prompt = `
        You are 'Sarah', a senior Technical Recruiter at ${job.companyName || 'SelectX'}.
        
        JOB DESCRIPTION: ${job.description}
        CANDIDATE RESUME: ${resumeText}
        APPLICANT NAME (User Account): "${user.name}"
        
        TASK:
        Evaluate the candidate based on Identity and Relevance.
        
        LOGIC & RULES:
        1. **Identity Verification:**
           - Compare the Name on the Resume with the APPLICANT NAME ("${user.name}").
           - Allow for minor variations (e.g., "Shreya Singh" vs "Shreya S", or "Radhika" vs "Radhika Sharma").
           - IF the names are completely different (e.g., "Shreya" vs "Rahul"):
             - Score = 0
             - Status = "Rejected"
             - Reason = "Identity Mismatch: The name on the resume does not match the applicant's profile name."

        2. **Relevance Scoring (Only if Identity Matches):**
           - Rate the resume from 0-100 based on the JOB DESCRIPTION.
           - Threshold for "Shortlisted" is 70.

        3. **Feedback Style:**
           - Write the 'reason' DIRECTLY TO THE CANDIDATE.
           - Use "You" instead of "The candidate".
           - Be professional, empathetic, and constructive.
           - Example Rejection: "While your Python skills are impressive, this role specifically requires 5 years of SEO experience which we didn't see in your profile."
           - Example Success: "Your experience with React and Node.js aligns perfectly with what we are looking for."
        
        Return STRICT JSON: { "score": number, "reason": "string", "status": "string" }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Cleanup JSON format
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      return JSON.parse(text);
    });

    // STEP 5: Update Application & Return ID
    const application = await step.run(
      "update-application-status",
      async () => {
        return await Application.findOneAndUpdate(
          { jobId, applicantId: userId },
          {
            atsScore: atsResult.score,
            status: atsResult.status,
          },
          { new: true }
        );
      }
    );

    // STEP 6: Decision (Interview or Reject)
    await step.run("handle-decision", async () => {
      let subject, body;
      let notifType = "rejected";
      let notifMessage = `Update: Your application for ${jobTitle} was not selected.`;

      if (atsResult.score >= 70) {
        // --- CASE: SHORTLISTED (Create Interview) ---

        // Generate Token & Expiry
        const token = crypto.randomBytes(32).toString("hex");
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 3); // Valid for 3 days

        // Create Interview Record (Using your schema + new fields)
        await Interview.create({
          applicationId: application._id,
          applicantId: userId,
          jobId: jobId,
          interviewToken: token,
          expiresAt: expiryDate,
          status: "pending",
          atsScore: atsResult.score,
          // 'sections' will be empty initially, filled during the interview
        });

        // The Frontend Link
        const link = `${process.env.FRONTEND_URL}/interview/start/${token}`;

        subject = `🎉 You are Shortlisted! AI Interview Invitation`;
        body = `Dear ${user.name},\n\nYour profile stood out to us (ATS Score: ${atsResult.score}/100)!\n\nThe next step is an AI-conducted technical interview. You can take this interview at any time within the next 72 hours.\n\n👉 CLICK HERE TO START: ${link}\n\nGood luck!\nSelectX Team`;

        notifType = "interview_scheduled";
        notifMessage = `Action Required: AI Interview scheduled for ${jobTitle}. Check email.`;
      } else {
        // --- CASE: REJECTED ---
        subject = `Update on your application for ${jobTitle}`;
        body = `Dear ${user.name},\n\nThank you for applying. Unfortunately, your profile was not a strong match for this specific role at this time.\n\nFeedback: ${atsResult.reason}\n\nWe encourage you to apply for future openings.`;
      }

      // Send Final Email
      await sendEmail(user.email, subject, body);

      // Send Final In-App Notification (Using your schema fields)
      await Notification.create({
        recipient: userId,
        message: notifMessage,
        type: notifType,
        relatedJob: jobId,
      });
    });

    return { status: "complete", score: atsResult.score };
  }
);
