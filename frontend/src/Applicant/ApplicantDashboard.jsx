import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import JobDetailsModal from "./JobDetailsModal";
import "./ApplicantDashboard.css";

function ApplicantDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    fetchJobs();
  }, [currentPage, locationFilter, jobTypeFilter]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12
      });

      if (locationFilter) params.append("location", locationFilter);
      if (jobTypeFilter) params.append("jobType", jobTypeFilter);

      const response = await axios.get(
        `${API_BASE_URL}/job/allWithRecruiter?${params.toString()}`
      );

      setJobs(response.data.data.jobs);
      setFilteredJobs(response.data.data.jobs);
      setTotalJobs(response.data.data.total);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter((job) => {
      const search = searchTerm.toLowerCase();
      return (
        job.title?.toLowerCase().includes(search) ||
        job.description?.toLowerCase().includes(search) ||
        job.companyName?.toLowerCase().includes(search) ||
        job.skillsRequired?.some(skill => skill.toLowerCase().includes(search))
      );
    });

    setFilteredJobs(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setJobTypeFilter("");
    setCurrentPage(1);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const totalPages = Math.ceil(totalJobs / 12);

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Find Your Dream Job</h1>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by job title, company, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="filters-container">
          <select
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
          </select>

          <select
            value={jobTypeFilter}
            onChange={(e) => {
              setJobTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">All Job Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="internship">Internship</option>
          </select>

          {(searchTerm || locationFilter || jobTypeFilter) && (
            <button onClick={handleClearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="results-info">
        <p>{filteredJobs.length} jobs found</p>
      </div>

      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card" onClick={() => handleJobClick(job)}>
              <div className="job-card-header">
                <h3 className="job-title">{job.title}</h3>
                <span className="job-type-badge">{job.jobType}</span>
              </div>

              <p className="company-name">{job.companyName || "Company Name"}</p>

              <div className="job-details">
                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.location || "Not specified"}</span>
                </div>

                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{job.salaryRange || "Not disclosed"}</span>
                </div>

                <div className="detail-item">
                  <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{job.experienceRequired || "Any"}</span>
                </div>
              </div>

              {job.description && (
                <p className="job-description">
                  {job.description.substring(0, 120)}
                  {job.description.length > 120 ? "..." : ""}
                </p>
              )}

              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <div className="skills-container">
                  {job.skillsRequired.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {job.skillsRequired.length > 3 && (
                    <span className="skill-tag more-skills">
                      +{job.skillsRequired.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <button className="apply-btn" onClick={(e) => {
                e.stopPropagation();
                handleJobClick(job);
              }}>
                View Details & Apply
              </button>
            </div>
          ))
        ) : (
          <div className="no-jobs">
            <svg className="no-jobs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>No jobs found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
}

export default ApplicantDashboard;




