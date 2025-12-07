import { serve } from "inngest/express";
import { inngest } from "../inngest/client.js";
import { processApplication } from "../inngest/functions.js";
import express from "express";

const router = express.Router();

router.use("/api/inngest", serve({
  client: inngest,
  functions: [processApplication],
}));

export default router;