import React from "react";
import "./Results.css";

const results = [
  {
    job: "Frontend Developer",
    company: "Acme Corp",
    score: 88,
    status: "Selected",
    comments: "Congratulations! You performed well in both the coding and voice rounds."
  },
  {
    job: "Backend Engineer",
    company: "BetaSoft",
    score: 75,
    status: "Shortlisted",
    comments: "You are shortlisted for the next interview round."
  },
  {
    job: "UI/UX Designer",
    company: "DesignPro",
    score: 65,
    status: "Rejected",
    comments: "Thank you for your time. Unfortunately, you were not selected."
  },
  {
    job: "Data Scientist",
    company: "DataSolutions",
    score: 82,
    status: "Selected",
    comments: "Excellent analytical skills demonstrated."
  }
];

export default function InterviewResultPage() {
  return (
    <div className="result-root">
      {results.map((result, idx) => (
        <div className={`result-card status-${result.status.toLowerCase()}`} key={idx}>
          <h2>Interview Result</h2>
          <div className="result-job">
            <b>{result.job}</b> @ {result.company}
          </div>
          <div className="result-score-section">
            <span className="score-label">AI Score</span>
            <span className="score-value">{result.score}%</span>
          </div>
          <div className={`result-status-badge result-${result.status.toLowerCase()}`}>
            {result.status}
          </div>
          <div className="result-comments">{result.comments}</div>
        </div>
      ))}
    </div>
  );
}

