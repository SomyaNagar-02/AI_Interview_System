import React from 'react';
import './Jobposts.css';

const sampleJobs = [
    { id: 1, title: 'Frontend Developer', applicants: 45, status: 'Active' },
    { id: 2, title: 'Node.js Backend Engineer', applicants: 22, status: 'Active' },
    { id: 3, title: 'UX/UI Designer', applicants: 67, status: 'Closed' },
    { id: 4, title: 'DevOps Specialist', applicants: 12, status: 'Draft' },
];

export function Jobposts() {
  return (
    <div className="job-postings-page">
      <div className="page-header">
        <h1>Job Postings</h1>
        <button className="action-button primary">+ Create New Job</button>
      </div>
      <div className="job-cards-grid">
        {sampleJobs.map(job => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.applicants} Applicants</p>
            <div className="job-card-footer">
              <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
              <a href="#">View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
