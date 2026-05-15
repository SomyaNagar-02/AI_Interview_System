import "./ApplicantsList.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ApplicantsList() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get("/api/v1/recruiter/getAppliedCand", {
          params: { jobId },
          withCredentials: true,
        });
        const jobs = res.data.data || [];

        if (jobs.length > 0) {
          setJobTitle(jobs[0].title);
          setApplicants(jobs[0].applicants || []);
        } else {
          setApplicants([]);
        }
      } catch (err) {
        console.error("Fetch applicants error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplicants();
  }, [jobId]);

  if (loading) {
    return (
      <div className="applicant-list-loading">
        <div className="spinner"></div>
        <p>Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="applicant-list-wrapper">
      <div className="applicant-list-header">
        <h2>Applicants for <span className="highlight">{jobTitle || "Job"}</span></h2>
        <p className="subtitle">Review and manage candidate applications for this role.</p>
      </div>

      {applicants.length === 0 ? (
        <div className="no-applicants">
          <p>No applicants have applied for this position yet.</p>
        </div>
      ) : (
        <div className="applicant-grid">
          {applicants.map((item) => (
            <div key={item.applicationId} className="applicant-card">
              <div className="card-header">
                <div className="user-main">
                  <h3>{item.user?.name || "No Name"}</h3>
                  <p className="user-email">{item.user?.email}</p>
                </div>
                <div className={`ats-badge ${item.atsResult?.toLowerCase()}`}>
                  <span className="score">{item.atsScore}%</span>
                  <span className="result">{item.atsResult}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="info-section">
                  <label>Experience</label>
                  <p>{item.profile?.experience || "Not specified"}</p>
                </div>

                <div className="info-section">
                  <label>Skills</label>
                  <div className="skills-tags">
                    {item.profile?.skills?.length > 0 ? (
                      item.profile.skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))
                    ) : (
                      <span className="no-skills">N/A</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <label>Interview Status</label>
                  <span className={`status-tag ${item.interviewStatus?.toLowerCase()}`}>
                    {item.interviewStatus || "Pending"}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <a
                  href={`/api/v1/application/resume/${item.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-btn"
                >
                  📄 View Resume
                </a>
                <button className="shortlist-btn">Shortlist</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
