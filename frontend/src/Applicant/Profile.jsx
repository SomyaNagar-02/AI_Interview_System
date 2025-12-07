import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api/v1";
  
  // Local SVG placeholder - no external dependency
  const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e5e7eb' width='150' height='150'/%3E%3Ctext fill='%239ca3af' font-family='Arial' font-size='50' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/applicant/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfileData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    setUploadingPic(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/applicant/upload-profile-pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      console.log("Upload response:", response.data);
      
      // Re-fetch the entire profile after successful upload
      await fetchProfile();
      
      setUploadingPic(false);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Failed to upload profile picture");
      setUploadingPic(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/applicant/delete`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container-main">
        <div className="profile-content-card">
          {/* Header */}
          <div className="profile-header-section">
            <h1 className="profile-page-title">My Profile</h1>
            <button 
              onClick={() => navigate("/ApplicantDashboard")} 
              className="profile-back-button"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Profile Picture Section */}
          <div className="profile-picture-section">
            <div className="profile-pic-wrapper">
              <img
                src={profileData?.profilePic || PLACEHOLDER_IMAGE}
                alt="Profile"
                className="profile-pic-image"
                key={profileData?.profilePic}
                onError={(e) => {
                  console.log("Image failed to load:", e.target.src);
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <label className="profile-pic-upload-label">
                {uploadingPic ? (
                  <div className="upload-spinner"></div>
                ) : (
                  <svg className="camera-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="file-input-hidden"
                  onChange={handleProfilePicUpload}
                  disabled={uploadingPic}
                />
              </label>
            </div>
          </div>

          {/* Name and Email */}
          <div className="profile-basic-info">
            <h2 className="profile-name-display">{profileData?.name || "N/A"}</h2>
            <p className="profile-email-display">{profileData?.email || "N/A"}</p>
          </div>

          {/* Divider */}
          <div className="profile-divider"></div>

          {/* Profile Information Sections */}
          <div className="profile-info-sections">
            {/* About/Summary */}
            {profileData?.summary && (
              <div className="profile-info-group">
                <label className="profile-info-label">About</label>
                <div className="profile-info-box">
                  <p className="profile-info-text">{profileData.summary}</p>
                </div>
              </div>
            )}

            {/* Personal Details */}
            <div className="profile-info-group">
              <label className="profile-info-label">Location</label>
              <div className="profile-info-box">
                <p className="profile-info-text">{profileData?.location || "Not specified"}</p>
              </div>
            </div>

            <div className="profile-info-group">
              <label className="profile-info-label">Country</label>
              <div className="profile-info-box">
                <p className="profile-info-text">{profileData?.country || "Not specified"}</p>
              </div>
            </div>

            <div className="profile-info-group">
              <label className="profile-info-label">Date of Birth</label>
              <div className="profile-info-box">
                <p className="profile-info-text">{formatDate(profileData?.dob)}</p>
              </div>
            </div>

            <div className="profile-info-group">
              <label className="profile-info-label">LinkedIn</label>
              <div className="profile-info-box">
                {profileData?.linkedin ? (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-linkedin-link"
                  >
                    {profileData.linkedin}
                  </a>
                ) : (
                  <p className="profile-info-text">Not specified</p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="profile-info-group">
              <label className="profile-info-label">Skills</label>
              <div className="profile-info-box">
                {profileData?.skills && profileData.skills.length > 0 ? (
                  <div className="profile-skills-tags">
                    {profileData.skills.map((skill, index) => (
                      <span key={index} className="profile-skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="profile-info-text-muted">No skills added yet</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="profile-info-group">
              <label className="profile-info-label">Experience</label>
              <div className="profile-info-box">
                <p className="profile-info-text">
                  {profileData?.experience || "No experience added yet"}
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="profile-info-group">
              <label className="profile-info-label">Education</label>
              <div className="profile-info-box">
                <p className="profile-info-text">
                  {profileData?.education || "No education added yet"}
                </p>
              </div>
            </div>

            {/* Projects */}
            <div className="profile-info-group">
              <label className="profile-info-label">Projects</label>
              <div className="profile-info-box">
                {profileData?.projects && profileData.projects.length > 0 ? (
                  <ul className="profile-projects-list">
                    {profileData.projects.map((project, index) => (
                      <li key={index} className="profile-project-item">{project}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="profile-info-text-muted">No projects added yet</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-action-buttons">
              <button onClick={() => navigate("/EditProfile")} className="profile-btn-edit">
                Edit Profile
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="profile-btn-delete">
                Delete Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="profile-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="profile-modal-title">Delete Profile?</h3>
            <p className="profile-modal-text">
              Are you sure you want to delete your profile? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="profile-modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="profile-modal-btn-cancel">
                Cancel
              </button>
              <button onClick={handleDeleteProfile} className="profile-modal-btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;


