import React from "react";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const daysAgo = (createdAt) => {
    const posted = new Date(createdAt);
    const now = new Date();
    const diff = now - posted;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="jobcard">
      {/* Top row */}
      <div className="jobcard-top">
        <p className="jobcard-date">
          {daysAgo(job.createdAt) === 0
            ? "Today"
            : `${daysAgo(job.createdAt)} days ago`}
        </p>
      </div>

      {/* Company + logo section */}
      <div className="jobcard-header">
        <div className="jobcard-logo">
          <span className="logo-text">
            {job.companyName ? job.companyName.charAt(0) : "C"}
          </span>
        </div>

        <div>
          <h3 className="jobcard-company">{job.companyName}</h3>
          <p className="jobcard-location">{job.location || "India"}</p>
        </div>
      </div>

      {/* Title + description */}
      <div className="jobcard-body">
        <h2 className="jobcard-title">{job.title}</h2>
        <p className="jobcard-description">{job.description}</p>
      </div>

      {/* Badges */}
      <div className="jobcard-badges">
        <span className="badge blue">
          {job.experienceRequired || "0-1 yr"}
        </span>
        <span className="badge purple">
          {job.jobType || "full-time"}
        </span>
        <span className="badge red">
          {job.salaryRange || "NA"}
        </span>
      </div>

      {/* Buttons */}
      <div className="jobcard-actions">
        <button
          className="btn-outline"
          onClick={() => {
            window.location.href = `/job/${job._id}`;
          }}
        >
          Details
        </button>

        <button className="btn-primary">Save</button>
      </div>
    </div>
  );
};

export default JobCard;

