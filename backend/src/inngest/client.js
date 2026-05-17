import { Inngest } from "inngest";

// Initialize the client — eventKey is optional in local dev (inngest dev server)
export const inngest = new Inngest({
  id: "SelectX",
  eventKey: "inngest_5q69c9i7f"  // Add this line
});
