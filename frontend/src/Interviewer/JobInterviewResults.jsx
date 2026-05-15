import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobInterviewResults.css";

const STATUS_CONFIG = {
  selected: { label: "Selected ✅", cls: "status-selected" },
  rejected: { label: "Rejected ❌", cls: "status-rejected" },
  pending:  { label: "Pending ⏳",  cls: "status-pending" },
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
          ← Back
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
          <span>📭</span>
          <p>No completed interviews for this job yet.</p>
        </div>
      ) : (
        <div className="jir-list">
          {results.map((r, idx) => {
            const statusCfg = STATUS_CONFIG[r.interviewResult] || STATUS_CONFIG.pending;
            const isOpen = expanded === r.interviewId;
            return (
              <div key={r.interviewId} className="jir-card">
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
                    <span className="jir-duration">⏱ {formatDuration(r.durationSeconds)}</span>
                    <span className="jir-date">📅 {formatDate(r.completedAt)}</span>
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
                    <div className="jir-summary-block">
                      <h4>🤖 AI Evaluation Summary</h4>
                      <p>{r.aiSummary}</p>
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
