import { Inngest } from "inngest";

// Initialize the client — eventKey is optional in local dev (inngest dev server)
export const inngest = new Inngest({ 
  id: "SelectX",
  ...(process.env.INNGEST_EVENT_KEY && { eventKey: process.env.INNGEST_EVENT_KEY })
});