import "./RecruiterDashboard.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiMapPin, 
  FiGlobe, 
  FiBriefcase, 
  FiSearch, 
  FiPlus, 
  FiTrash2, 
  FiDollarSign 
} from "react-icons/fi";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserSafe = () => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const user = getUserSafe();

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/api/v1/job/getJobs/${user._id}`, {
          withCredentials: true,
        });
        setJobs(res.data.data || []);
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/v1/recruiter/getRecruiterDetails", {
          withCredentials: true,
        });
        setProfile(res.data.data);
      } catch (err) {
        console.error("Error loading recruiter profile:", err);
      }
    };

    if (user?._id) {
      Promise.all([fetchJobs(), fetchProfile()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
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

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  };

  const filteredJobs = jobs
    .filter((job) => job.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

  // Stats
  const activeRolesCount = jobs.length;
  const fullTimeCount = jobs.filter((j) => j.jobType === "full-time").length;
  const internshipCount = jobs.filter((j) => j.jobType === "internship").length;
  const remoteCount = jobs.filter((j) => j.location?.toLowerCase().includes("remote")).length;

  if (loading) {
    return (
      <div className="recruiter-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your portal...</p>
      </div>
    );
  }

  return (
    <div className="recruiter-dashboard-portal">
      {/* ── Left Sidebar (Company Info & Actions) ── */}
      <div className="recruiter-sidebar">
        {profile ? (
          <div className="company-quick-card">
            <div className="company-logo-badge">
              {profile.logo ? (
                <img src={profile.logo} alt={profile.companyName} />
              ) : (
                <div className="company-logo-placeholder">
                  {profile.companyName?.charAt(0)}
                </div>
              )}
            </div>
            <h2>{profile.companyName}</h2>
            <p className="company-tagline">{profile.industry || "Technology Company"}</p>
            
            <div className="company-meta-details">
              <span>
                <FiMapPin className="sidebar-meta-icon" /> {profile.location || "Remote HQ"}
              </span>
              {profile.website && (
                <a href={ensureAbsoluteUrl(profile.website)} target="_blank" rel="noreferrer">
                  <FiGlobe className="sidebar-meta-icon" /> Visit Website
                </a>
              )}
            </div>
            
            <Link to="/recruiter/profile" className="edit-profile-shortcut">
              Edit Profile Settings
            </Link>
          </div>
        ) : (
          <div className="setup-profile-card">
            <h3><FiBriefcase className="setup-title-icon" /> Finish Setup</h3>
            <p>Complete your company branding details to unlock recruiter analytics.</p>
            <button onClick={() => navigate("/register")} className="setup-btn">
              Configure Profile
            </button>
          </div>
        )}

        <div className="search-filters-card">
          <h3><FiSearch className="setup-title-icon" /> Find Job Openings</h3>
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Right Main Area (Stats and Grid) ── */}
      <div className="recruiter-main">
        <div className="recruiter-main-header">
          <div>
            <h1 className="main-tagline">Employer Portal</h1>
            <p className="main-subtitle">Manage your active job postings and evaluate talent.</p>
          </div>
          <Link to="/recruiter/post-job" className="post-job-action-btn">
            <FiPlus className="post-btn-icon" /> Add New Position
          </Link>
        </div>

        {/* Dynamic Landscape Stats Row */}
        <div className="recruiter-stats-row">
          <div className="stat-card">
            <span className="stat-num">{activeRolesCount}</span>
            <span className="stat-label">Active Jobs</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{fullTimeCount}</span>
            <span className="stat-label">Full-Time Roles</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{internshipCount}</span>
            <span className="stat-label">Internships</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{remoteCount}</span>
            <span className="stat-label">Remote Jobs</span>
          </div>
        </div>

        {/* Job Cards Section */}
        <h2 className="section-title-jobs">Active Job Openings ({filteredJobs.length})</h2>
        
        {filteredJobs.length === 0 ? (
          <div className="no-jobs-card">
            <span className="no-jobs-icon"><FiBriefcase /></span>
            <h3>No Jobs Found</h3>
            <p>Create a job listing to begin conducting automated AI interviews.</p>
            <Link to="/recruiter/post-job" className="no-jobs-btn">Post a Job</Link>
          </div>
        ) : (
          <div className="job-card-grid">
            {filteredJobs.map((job) => (
              <div key={job._id} className="modern-job-card">
                <div className="modern-job-header">
                  <span className="modern-job-type">{job.jobType}</span>
                  <div className="modern-job-actions">
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="modern-delete-btn"
                      title="Delete Posting"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <h3 className="modern-job-title">{job.title}</h3>
                <p className="modern-company-name">{job.companyName}</p>

                <div className="modern-job-specs">
                  <div className="spec-item">
                    <FiMapPin className="spec-icon" /> {job.location || "Remote"}
                  </div>
                  <div className="spec-item">
                    <FiDollarSign className="spec-icon" /> {job.salaryRange || "Not Disclosed"}
                  </div>
                </div>

                <div className="modern-job-footer">
                  <Link to={`/recruiter/applicants/${job._id}`} className="modern-view-btn">
                    View Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
