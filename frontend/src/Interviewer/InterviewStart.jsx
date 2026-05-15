import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Vapi from "@vapi-ai/web";
import "./InterviewStart.css";

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

export default function InterviewStart() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // 1. This array will hold the transcript in real-time
  const conversationRef = useRef([]); 
  const autoEndTimer = useRef(null);

  useEffect(() => {
    
    // --- LISTENER 1: CAPTURE SPEECH LIVE ---
    const onMessage = (message) => {
      // We only care about 'final' sentences (complete thoughts)
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        
        const newMessage = {
          role: message.role, // 'user' or 'assistant'
          content: message.transcript,
          timestamp: new Date().toISOString()
        };
        
        // Push to our local storage immediately
        conversationRef.current.push(newMessage);
        console.log("Captured:", newMessage);
      }
    };

    // --- LISTENER 2: CALL ENDS (Auto or Manual) ---
    const onCallEnd = async (call) => {
      console.log("✅ Interview ended.");
      setActive(false);
      
      // Clear the timer so it doesn't fire later
      if (autoEndTimer.current) clearTimeout(autoEndTimer.current);

      // 2. GENERATE TRANSCRIPT INSTANTLY
      // We combine our local array into a text block. 
      // This is instant—no waiting for the server.
      const fullTranscript = conversationRef.current
        .map(msg => `${msg.role}: ${msg.content}`)
        .join("\n");

      console.log("📝 Transcript Ready:", fullTranscript);

      // 3. Send to Backend
      try {
        setSaving(true);
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/interview/complete/${token}`,
          {
            transcript: fullTranscript,
            durationSeconds: call?.seconds || 120
          }
        );
        // Redirect to completion page — no results shown to candidate
        navigate("/interview-completed");
      } catch (saveErr) {
        console.error("❌ Save failed:", saveErr);
        setSaving(false);
      }
    };

    const onError = (e) => console.error(e);

    // Attach Listeners
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage); 
    vapi.on("error", onError);

    return () => {
      // FIX: Never use removeAllListeners on a global instance. 
      // It wipes internal Vapi SDK listeners during StrictMode unmounts.
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
    };
  }, [token]);

  const startInterview = async () => {
    try {
      setLoading(true);
      // Reset transcript bucket
      conversationRef.current = []; 

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/interview/validate/${token}`);
      const { jobTitle, jobDescription, requiredSkills, resumeText } = res.data.data;

      const assistantOverrides = {
        // Crucial: This ensures 'message' events actually fire
        clientMessages: ["transcript", "hang", "function-call", "speech-update", "metadata", "conversation-update"],
        variableValues: { jobDescription, resumeText, jobTitle, requiredSkills },
      };

      vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID, assistantOverrides);
      setActive(true);

      // --- 4. TIMER SET TO 2 MINUTES ---
      console.log("⏰ Timer started: 2 Minutes");
      autoEndTimer.current = setTimeout(() => {
        console.log("⏰ 2 Minutes reached. Stopping call...");
        vapi.stop(); // This triggers onCallEnd automatically
      }, 2 * 60 * 1000); // 2 * 60s * 1000ms = 120,000ms

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const endInterview = () => {
    vapi.stop(); 
  };

  if (saving) {
    return (
      <div className="interview-page">
        <div className="interview-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>⏳</div>
          <h2 style={{ color: "#e2e8f0" }}>Saving your interview...</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Please wait, do not close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-page">
      <div className="interview-card">
        <h1>AI Interview</h1>
        <p>Limit: 2 Minutes</p>
        <div className="button-group">
          <button
            className="start-btn"
            onClick={startInterview}
            disabled={loading || active}
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
          <button
            className="end-btn"
            onClick={endInterview}
            disabled={!active}
          >
            End Interview
          </button>
        </div>
        <p className="status">{active ? "🟢 Active" : "🔴 Ready"}</p>
      </div>
    </div>
  );
}