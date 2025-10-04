import React, { useState } from "react";
import "./InterviewPage.css";

export default function InterviewPage() {
  const [currentTab, setCurrentTab] = useState("voice");
  const [code, setCode] = useState("// Write your code here...");
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Add real voice recording logic here
  };

  const handleCodeChange = (e) => setCode(e.target.value);

  const submitCode = () => {
    alert("Submitted code:\n" + code);
    // Integrate with backend here
  };

  return (
    <div className="interview-page">
      <h1>AI-Powered Interview</h1>
      <div className="tab-header">
        <button className={currentTab === "voice" ? "active" : ""} onClick={() => setCurrentTab("voice")}>
          AI Voice Interview
        </button>
        <button className={currentTab === "coding" ? "active" : ""} onClick={() => setCurrentTab("coding")}>
          Coding Round
        </button>
      </div>

      {currentTab === "voice" && (
        <div className="voice-section">
          <h2>AI Voice Interview</h2>
          <p>Click start to begin recording your answers.</p>
          <button className={`record-btn ${isRecording ? "recording" : ""}`} onClick={toggleRecording}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <div className="voice-visualizer">{isRecording ? "🎙️ Recording..." : "Press 'Start Recording'"}</div>
        </div>
      )}

      {currentTab === "coding" && (
        <div className="coding-section">
          <h2>Coding Round</h2>
          <textarea
            className="code-editor"
            value={code}
            onChange={handleCodeChange}
            spellCheck="false"
          />
          <button className="submit-code-btn" onClick={submitCode}>
            Submit Code
          </button>
        </div>
      )}
    </div>
  );
}
