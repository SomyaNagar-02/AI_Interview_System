import "./RecruiterDashboard.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {useEffect} from 'react';

export default function RecruiterDashboard() {
  const [search, setSearch] = useState("");
  const [jobs,setJobs]=useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/job/getJobs/${user._id} `,   
        { withCredentials: true }
      );

      setJobs(res.data.data);
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  };

  fetchJobs();
}, []);
  const filteredJobs = jobs
    .filter((job) =>
      job.title.toLowerCase().startsWith(search.toLowerCase())
    )
    .sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );

  return (
    <div className="recruiter-dashboard">
      {/* Top tagline + search */}
      <div className="recruiter-dashboard-header">
        <h1 className="recruiter-dashboard-tagline">
          Find Your Next Great Hire
        </h1>
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
          <div key={job.id} className="job-card">
            <div className="job-title">{job.title}</div>
            <div className="company">{job.companyName}</div>
            <div className="job-info">Location: {job.location}</div>
            <div className="job-info">Salary: {job.salaryRange}</div>

            {/* navigate to ApplicantsList for this job */}
            {/* navigate to ApplicantsList for this job */}
        <Link
            to={`/recruiter/applicants/${job._id}`}   // ✅ use /recruiter
            className="view-btn"
            >
            View Applicants
        </Link>

          </div>
        ))}

        {filteredJobs.length === 0 && (
          <p style={{ marginTop: "1rem", color: "#6b7280" }}>
            No jobs match your search.
          </p>
        )}
      </div>
    </div>
  );
}
