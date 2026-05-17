import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./RecruiterResults.css";
import { FiSearch, FiFileText, FiMapPin, FiArrowRight } from "react-icons/fi";

export default function RecruiterResults() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchResultJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "/api/v1/interview/recruiter/result-jobs",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setJobs(res.data.data);
      } catch (err) {
        console.error("Error fetching result jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResultJobs();
  }, []);

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rresults-page">
      <div className="rresults-header">
        <div>
          <h1 className="rresults-title">Interview Results</h1>
          <p className="rresults-sub">
            Click on a job posting to view all candidate scores & decisions.
          </p>
        </div>
        <div className="rresults-search-wrapper">
          <FiSearch className="rresults-search-icon" />
          <input
            type="text"
            className="rresults-search"
            placeholder="Search job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="rresults-loading">
          <div className="rresults-spinner" />
          <p>Loading results...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rresults-empty">
          <span className="rresults-empty-icon"><FiFileText /></span>
          <p>No completed interviews found yet.</p>
          <small>Results will appear here once candidates finish their AI interviews.</small>
        </div>
      ) : (
        <div className="rresults-grid">
          {filtered.map((job) => (
            <Link
              key={job._id}
              to={`/recruiter/results/${job._id}`}
              className="rresult-card"
            >
              <div className="rresult-card-top">
                <span className="rresult-badge">{job.jobType}</span>
                <span className="rresult-count">
                  {job.completedCount} interview{job.completedCount !== 1 ? "s" : ""}
                </span>
              </div>
              <h2 className="rresult-job-title">{job.title}</h2>
              <p className="rresult-company">{job.companyName}</p>
              <p className="rresult-location">
                <FiMapPin className="card-location-icon" /> {job.location || "Remote"}
              </p>
              <div className="rresult-footer">
                <span className="rresult-view">
                  View Results <FiArrowRight className="view-arrow" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
