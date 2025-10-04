import React from "react";
import "./ApplicantDashboard.css";
import { useNavigate } from "react-router-dom";


const applications = [
  { job: "Frontend Developer", company: "Acme Corp", status: "ATS Passed" },
  { job: "React UI Designer", company: "DesignPro", status: "Interview Scheduled" },
  { job: "Node.js Engineer", company: "BetaSoft", status: "Result Pending" }
];

const upcomingInterview = {
  job: "React UI Designer",
  company: "DesignPro",
  datetime: "2025-10-15 11:00 AM",
  joinActive: true
};

const interviewHistory = [
  { job: "Frontend Developer", company: "Acme Corp", score: 88, result: "Selected" },
  { job: "Node.js Engineer", company: "BetaSoft", score: 67, result: "Rejected" }
];

export default function ApplicantDashboard() {
    const navigate = useNavigate();
  return (
    <div className="adash-root">
      <aside className="adash-sidebar">
        <h2>Recruit AI</h2>
        <nav>
          <a className="active">Dashboard</a>
          <a onClick={() => navigate("/JobPosting")}>Job Applications</a>
          <a onClick={() => navigate("/InterviewPage")}>Interviews</a>
           <a onClick={() => navigate("/Results")}>Results</a>
           <a onClick={() => navigate("/EditProfile")}>Profile</a>
        </nav>
      </aside>
      <main className="adash-main">
        <header className="adash-header">
           <span className="icon" onClick={() => navigate("/EditProfile")} title="profile">A</span>
          <span className="icon" onClick={() => navigate("/settings")} title="settings">⚙️</span>
           <span className="icon" onClick={() => navigate("/notifications")} title="Notifications">🔔</span>
        </header>
        <section className="adash-panel">
          <h4>My Applications</h4>
          <div className="thead">
            <span>Job Title</span>
            <span>Company</span>
            <span>Status</span>
          </div>
          {applications.map((a, i) => (
            <div className="trow" key={i}>
              <span>{a.job}</span>
              <span>{a.company}</span>
              <span className={`status status-${a.status.replace(/\s/g, '').toLowerCase()}`}>{a.status}</span>
            </div>
          ))}
        </section>
        <section className="adash-panel">
          <h4>Upcoming Interview</h4>
          <div className="upcoming-card">
            <div>
                <b>{upcomingInterview.job}</b> @ {upcomingInterview.company}
            </div>
            <div className="adash-dt">{upcomingInterview.datetime}</div>
            <button className={`joinbtn${!upcomingInterview.joinActive ? " disabled" : ""}`} disabled={!upcomingInterview.joinActive}>Join Interview</button>
          </div>
        </section>
        <section className="adash-panel">
          <h4>Interview History</h4>
          <div className="thead">
            <span>Job Title</span>
            <span>Company</span>
            <span>Score</span>
            <span>Result</span>
          </div>
          {interviewHistory.map((h, i) => (
            <div className="trow" key={i}>
              <span>{h.job}</span>
              <span>{h.company}</span>
              <span>{h.score}</span>
              <span className={`history-badge ${h.result.toLowerCase()}`}>{h.result}</span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

