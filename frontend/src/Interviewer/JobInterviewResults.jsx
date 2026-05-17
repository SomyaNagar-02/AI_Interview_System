import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobInterviewResults.css";
import { 
  FiArrowLeft, 
  FiClock, 
  FiCalendar, 
  FiInbox, 
  FiFileText, 
  FiCpu, 
  FiUser, 
  FiMessageSquare 
} from "react-icons/fi";

const STATUS_CONFIG = {
  selected: { label: "Selected ✅", cls: "status-selected" },
  rejected: { label: "Rejected ❌", cls: "status-rejected" },
  pending:  { label: "Pending ⏳",  cls: "status-pending" },
};

const parseTranscript = (transcriptText) => {
  if (!transcriptText || transcriptText.trim() === "" || transcriptText === "No transcript available.") {
    return [{ speaker: "System", text: "No speech detected or recorded.", role: "system" }];
  }
  
  if (transcriptText.startsWith("No speech was detected")) {
    return [{ speaker: "System", text: transcriptText, role: "system" }];
  }
  
  const lines = transcriptText.split("\n").map(line => line.trim()).filter(Boolean);
  
  return lines.map((line) => {
    if (line.startsWith("assistant:")) {
      return {
        speaker: "Interviewer (AI)",
        text: line.replace(/^assistant:\s*/i, ""),
        role: "assistant"
      };
    } else if (line.startsWith("user:")) {
      return {
        speaker: "Candidate",
        text: line.replace(/^user:\s*/i, ""),
        role: "user"
      };
    } else {
      return {
        speaker: "System",
        text: line,
        role: "system"
      };
    }
  });
};

export default function JobInterviewResults() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `/api/v1/interview/results/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobTitle = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `/api/v1/job/${jobId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobTitle(res.data.data?.title || "Job");
      } catch (_) {
        setJobTitle("Job");
      }
    };

    fetchResults();
    fetchJobTitle();
  }, [jobId]);

  const formatDuration = (secs) => {
    if (!secs) return "—";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const scoreColor = (score) => {
    if (score === null || score === undefined) return "#9ca3af";
    if (score >= 75) return "#059669";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="jir-page">
      {/* ── Header ── */}
      <div className="jir-header">
        <button className="jir-back" onClick={() => navigate("/recruiter/results")}>
          <FiArrowLeft className="jir-back-icon" /> Back
        </button>
        <div>
          <h1 className="jir-title">Results for: <span>{jobTitle}</span></h1>
          <p className="jir-sub">{results.length} candidate{results.length !== 1 ? "s" : ""} completed the AI interview</p>
        </div>
      </div>

      {loading ? (
        <div className="jir-loading">
          <div className="jir-spinner" />
          <p>Loading results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="jir-empty">
          <span className="jir-empty-icon"><FiInbox /></span>
          <p>No completed interviews for this job yet.</p>
        </div>
      ) : (
        <div className="jir-list">
          {results.map((r, idx) => {
            const cardThemeClass = 
              r.interviewResult === "selected" ? "jir-card-selected" :
              r.interviewResult === "rejected" ? "jir-card-rejected" : "jir-card-completed";
            const statusCfg = STATUS_CONFIG[r.interviewResult] || STATUS_CONFIG.pending;
            const isOpen = expanded === r.interviewId;

            return (
              <div key={r.interviewId} className={`jir-card ${cardThemeClass}`}>
                {/* ── Top Row ── */}
                <div className="jir-card-top">
                  <div className="jir-rank">#{idx + 1}</div>

                  <div className="jir-candidate">
                    <p className="jir-name">{r.candidateName}</p>
                    <p className="jir-email">{r.candidateEmail}</p>
                  </div>

                  <div className="jir-scores">
                    <div className="jir-score-block">
                      <span className="jir-score-label">AI Score</span>
                      <span
                        className="jir-score-value"
                        style={{ color: scoreColor(r.aiScore) }}
                      >
                        {r.aiScore !== null ? `${r.aiScore}/100` : "—"}
                      </span>
                    </div>
                    <div className="jir-score-block">
                      <span className="jir-score-label">ATS Score</span>
                      <span className="jir-score-value jir-ats">
                        {r.atsScore !== null ? `${r.atsScore}/100` : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="jir-meta">
                    <span className={`jir-status ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                    <span className="jir-duration">
                      <FiClock className="jir-meta-icon" /> {formatDuration(r.durationSeconds)}
                    </span>
                    <span className="jir-date">
                      <FiCalendar className="jir-meta-icon" /> {formatDate(r.completedAt)}
                    </span>
                  </div>

                  <button
                    className="jir-toggle"
                    onClick={() => setExpanded(isOpen ? null : r.interviewId)}
                  >
                    {isOpen ? "Hide Details ▲" : "View Details ▼"}
                  </button>
                </div>

                {/* ── Expanded Details ── */}
                {isOpen && (
                  <div className="jir-details">
                    <div className="jir-details-top-grid">
                      <div className="jir-summary-block">
                        <h4><FiCpu className="jir-section-title-icon" /> AI Evaluation Summary</h4>
                        <p>{r.aiSummary}</p>
                      </div>

                      <div className="jir-info-block">
                        <h4><FiUser className="jir-section-title-icon" /> Candidate Details</h4>
                        <div className="jir-info-content">
                          <div className="jir-info-row">
                            <span className="jir-info-label">Name:</span>
                            <span className="jir-info-val">{r.candidateName}</span>
                          </div>
                          <div className="jir-info-row">
                            <span className="jir-info-label">Email:</span>
                            <span className="jir-info-val">{r.candidateEmail}</span>
                          </div>
                          <div className="jir-info-row">
                            <span className="jir-info-label">Completed On:</span>
                            <span className="jir-info-val">{formatDate(r.completedAt)}</span>
                          </div>
                          <div className="jir-info-row">
                            <span className="jir-info-label">Duration:</span>
                            <span className="jir-info-val">{formatDuration(r.durationSeconds)}</span>
                          </div>
                          <div className="jir-info-row">
                            <span className="jir-info-label">ATS Score:</span>
                            <span className="jir-info-val highlight-score">{r.atsScore !== null ? `${r.atsScore}/100` : "—"}</span>
                          </div>
                          <div className="jir-info-row">
                            <span className="jir-info-label">AI Score:</span>
                            <span 
                              className="jir-info-val highlight-score"
                              style={{ color: scoreColor(r.aiScore), fontWeight: 800 }}
                            >
                              {r.aiScore !== null ? `${r.aiScore}/100` : "—"}
                            </span>
                          </div>
                          {r.resumeUrl && (
                            <a
                              href={`/api/v1/application/resume/${r.resumeUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="jir-resume-btn"
                            >
                              <FiFileText className="jir-resume-btn-icon" /> View Resume
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="jir-transcript-block">
                      <h4><FiMessageSquare className="jir-section-title-icon" /> Full Interview Transcript</h4>
                      <div className="jir-chat-container">
                        {parseTranscript(r.fullTranscript).map((msg, mIdx) => {
                          const isUser = msg.role === "user";
                          const isSystem = msg.role === "system";
                          return (
                            <div 
                              key={mIdx} 
                              className={`jir-chat-bubble-wrapper ${isUser ? "chat-candidate" : isSystem ? "chat-system" : "chat-assistant"}`}
                            >
                              <span className="jir-chat-speaker">{msg.speaker}</span>
                              <div className="jir-chat-bubble">
                                <p>{msg.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
