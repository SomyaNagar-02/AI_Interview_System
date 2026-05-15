import "./RecruiterDashboard.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RecruiterDashboard() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`/api/v1/job/getJobs/${user._id}`, {
          withCredentials: true,
        });
        setJobs(res.data.data);
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    };
    if (user?._id) fetchJobs();
  }, [user?._id]);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`/api/v1/job/deleteJob/${jobId}`, {
        withCredentials: true,
      });
      setJobs(jobs.filter((j) => j._id !== jobId));
      alert("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  const filteredJobs = jobs
    .filter((job) => job.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

  return (
    <div className="recruiter-dashboard">
      {/* Top tagline + search */}
      <div className="recruiter-dashboard-header">
        <h1 className="recruiter-dashboard-tagline">Find Your Next Great Hire</h1>
        <div className="search-area">
          <input
            type="text"
            className="search-input"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Job cards */}
      <div className="job-card-container">
        {filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-card-top">
              <div className="job-title">{job.title}</div>
              <span className="job-type-tag">{job.jobType}</span>
            </div>
            <div className="company">{job.companyName}</div>
            <div className="job-info">📍 {job.location || "Remote"}</div>
            <div className="job-info">💰 {job.salaryRange || "Not Disclosed"}</div>

            <div className="job-card-actions">
              <Link to={`/recruiter/applicants/${job._id}`} className="view-btn">
                View Applicants
              </Link>
              <button
                onClick={() => handleDelete(job._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <p className="no-jobs-msg">No jobs match your search.</p>
        )}
      </div>
    </div>
  );
}
