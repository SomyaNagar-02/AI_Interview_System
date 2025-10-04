import React, { useState } from "react";
import "./JobListing.css";

const sampleJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Acme Corp",
    location: "New York, USA",
    description: "Build responsive and modern web apps...",
    status: "Open",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "BetaSoft",
    location: "San Francisco, USA",
    description: "Design and develop scalable APIs...",
    status: "Open",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignPro",
    location: "Remote",
    description: "Lead user experience initiatives...",
    status: "Closed",
  },
];

export default function JobListingsPage() {
  // Store selected resumes to apply for each job by ID
  const [selectedResumes, setSelectedResumes] = useState({});

  const handleFileChange = (jobId, e) => {
    setSelectedResumes((prev) => ({
      ...prev,
      [jobId]: e.target.files[0],
    }));
  };

  const handleApply = (jobId) => {
    const resume = selectedResumes[jobId];
    if (!resume) {
      alert("Please upload your resume before applying.");
      return;
    }
    // Here send 'resume' along with 'jobId' to backend API
    alert(`Applied to job #${jobId} with resume file ${resume.name}`);
  };

  return (
    <div className="bgcolor">
    <div className="jobs-root">
      <h2 color="white">Job Listings</h2>
      <div className="jobs-list">
        {sampleJobs.map((job) => (
          <div className={`job-card ${job.status === "Closed" ? "closed" : ""}`} key={job.id}>
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="job-company">{job.company}</span>
            </div>
            <div className="job-location">{job.location}</div>
            <p className="job-desc">{job.description}</p>
            <div className="job-apply-section">
              {job.status === "Closed" ? (
                <button disabled className="apply-btn closed-btn">Closed</button>
              ) : (
                <>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(job.id, e)}
                    className="resume-upload"
                  />
                  <button onClick={() => handleApply(job.id)} className="apply-btn">
                    Apply
                  </button>
                </>
              )}
            </div>
          </div>
         
        ))}
      </div>
    </div>
    </div>
  );
}


