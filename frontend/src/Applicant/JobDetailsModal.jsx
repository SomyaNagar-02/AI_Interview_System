import { useState } from "react";
import axios from "axios";
import "./JobDetailsModal.css";

function JobDetailsModal({ job, onClose }) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api/v1";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Max 5MB");
      return;
    }

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF or DOC files allowed");
      return;
    }

    setResume(file);
  };

  const submitApplication = async () => {
    if (!resume) {
      alert("Please upload resume");
      return;
    }

    setApplying(true);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobId", job._id);
    if (coverLetter) formData.append("coverLetter", coverLetter);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/application/${job._id}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Application submitted!");
      setShowApplyModal(false);
      onClose();
    } catch (err) {
      console.error("Application error:", err);
      alert(err.response?.data?.message || "Application failed");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <div className="job-modal-header">
          <div className="modal-header-content">
            <h2>{job.title}</h2>
            <span className="modal-job-type">{job.jobType}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="job-modal-body">
          <p className="modal-company">{job.companyName || "Company Name"}</p>

          <div className="modal-info-grid">
            <div className="modal-info-item">
              <svg className="modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <div>
                <span className="modal-label">Location</span>
                <span className="modal-value">{job.location || "Not specified"}</span>
              </div>
            </div>

            <div className="modal-info-item">
              <svg className="modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="modal-label">Salary</span>
                <span className="modal-value">{job.salaryRange || "Not disclosed"}</span>
              </div>
            </div>

            <div className="modal-info-item">
              <svg className="modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <span className="modal-label">Experience</span>
                <span className="modal-value">{job.experienceRequired || "Any"}</span>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h3>Job Description</h3>
            <p className="modal-description">{job.description}</p>
          </div>

          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="modal-section">
              <h3>Required Skills</h3>
              <div className="modal-skills">
                {job.skillsRequired.map((skill, i) => (
                  <span key={i} className="modal-skill">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="job-modal-footer">
          <button className="modal-apply-btn" onClick={() => setShowApplyModal(true)}>
            Apply Now
          </button>
        </div>

        {showApplyModal && (
          <div className="apply-modal-overlay" onClick={() => setShowApplyModal(false)}>
            <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
              <div className="apply-modal-header">
                <h3>Apply for {job.title}</h3>
                <button className="apply-close" onClick={() => setShowApplyModal(false)}>×</button>
              </div>

              <div className="apply-modal-body">
                <div className="apply-field">
                  <label>Resume *</label>
                  <div className="upload-box">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      id="resume-file"
                      hidden
                    />
                    <label htmlFor="resume-file" className="upload-btn">
                      <svg className="upload-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>{resume ? resume.name : "Upload Resume (PDF/DOC)"}</span>
                    </label>
                  </div>
                  {resume && <p className="file-selected">✓ {resume.name}</p>}
                </div>

                <div className="apply-field">
                  <label>Cover Letter (optional)</label>
                  <textarea
                    rows="5"
                    placeholder="Why are you a good fit?"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
              </div>

              <div className="apply-modal-footer">
                <button className="btn-cancel" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-submit" 
                  onClick={submitApplication}
                  disabled={applying || !resume}
                >
                  {applying ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetailsModal;


