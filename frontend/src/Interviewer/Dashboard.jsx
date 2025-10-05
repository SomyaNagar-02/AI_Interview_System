import React, { useState } from 'react';
import "./Dashboard.css"; 

const mockJobs = [
    { id: 1, title: 'Frontend Developer', applicants: 45, status: 'Active' },
    { id: 2, title: 'Node.js Backend Engineer', applicants: 22, status: 'Active' },
    { id: 3, title: 'UX/UI Designer', applicants: 67, status: 'Closed' },
];

const mockCandidates = {
    atsPassed: [ { id: 101, name: 'John Doe', score: 'N/A' }, { id: 102, name: 'Jane Smith', score: 'N/A' },],
    interviewScheduled: [{ id: 201, name: 'Peter Jones', score: 'N/A' },],
    interviewCompleted: [{ id: 301, name: 'Sarah Lee', score: '88%' }, { id: 302, name: 'Mike Chen', score: '72%' },],
};


export function Dashboard() {
    const [activeTab, setActiveTab] = useState('atsPassed');

    return (
        <>
            <header className="dashboard-header">
                <div className="company-logo">Company Inc.</div>
                <div className="header-actions">
                    <button className="post-job-btn">+ Post New Job</button>
                    <div className="profile-icon">R</div>
                </div>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h3>Job Openings</h3>
                    {mockJobs.map(job => (
                        <div className="job-opening-item" key={job.id}>
                            <span>{job.title}</span>
                            <span>{job.applicants} Applicants</span>
                            <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
                        </div>
                    ))}
                </section>

                <section className="dashboard-section">
                    <h3>Applicants Pipeline for "Frontend Developer"</h3>
                    <div className="pipeline-tabs">
                         <button
                                className={`tab ${activeTab === 'atsPassed' ? 'active' : ''}`}
                                onClick={() => setActiveTab('atsPassed')}>
                                ATS Passed ({mockCandidates.atsPassed.length})
                            </button>
                            <button
                                className={`tab ${activeTab === 'interviewScheduled' ? 'active' : ''}`}
                                onClick={() => setActiveTab('interviewScheduled')}>
                                Interview Scheduled ({mockCandidates.interviewScheduled.length})
                            </button>
                            <button
                                className={`tab ${activeTab === 'interviewCompleted' ? 'active' : ''}`}
                                onClick={() => setActiveTab('interviewCompleted')}>
                                Interview Completed ({mockCandidates.interviewCompleted.length})
                            </button>
                    </div>
                     <div className="pipeline-content">
                            {mockCandidates[activeTab].map(candidate => (
                                <div className="candidate-row" key={candidate.id}>
                                    <span className="candidate-name">{candidate.name}</span>
                                    <span className="candidate-score">AI Score: {candidate.score}</span>
                                    <div className="candidate-actions">
                                        <a href="#view-resume" className="action-link">View Resume</a>
                                        <button className="action-btn accept">Accept</button>
                                        <button className="action-btn reject">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                </section>
            </main>
        </>
    );
}