import "./RecruiterProfile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaGlobe, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function RecruiterProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    industry: "",
    companySize: "",
    foundedDate: "",
    logo: "",
    linkedin: "",
    twitter: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/recruiter/getRecruiterDetails", {
        withCredentials: true,
      });
      const data = res.data.data;
      setProfile(data);
      setEditForm({
        companyName: data.companyName || "",
        description: data.description || "",
        website: data.website || "",
        location: data.location || "",
        industry: data.industry || "",
        companySize: data.companySize || "",
        foundedDate: data.foundedDate || "",
        logo: data.logo || "",
        linkedin: data.linkedin || "",
        twitter: data.twitter || "",
      });
    } catch (err) {
      console.error("Profile fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/v1/recruiter/editRecruiter", editForm, {
        withCredentials: true,
      });
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Saving failed:", err);
      alert("Update failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your recruiter profile? This will not delete your account, but you will lose company info.")) return;

    try {
      await axios.delete("/api/v1/recruiter/deleteProfile", {
        withCredentials: true,
      });
      localStorage.removeItem("user");
      alert("Profile deleted");
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="profile-loading">
      <div className="spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  if (!profile) return (
    <div className="profile-error">
      <h2>No Profile Found</h2>
      <p>You haven't set up your recruiter profile yet.</p>
      <button onClick={() => navigate("/register")}>Create Profile</button>
    </div>
  );

  return (
    <div className="recruiter-profile-wrapper">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="header-left">
            <div className="logo-container">
              {profile.logo ? (
                <img src={profile.logo} alt="Logo" className="company-logo" />
              ) : (
                <div className="logo-placeholder">{profile.companyName?.charAt(0)}</div>
              )}
            </div>
            <div className="title-info">
              <h1>{profile.companyName}</h1>
              <p className="industry-tag">{profile.industry || "Industry not specified"}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate("/recruiter")}>Dashboard</button>
            {!isEditing ? (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
            ) : (
              <div className="edit-actions">
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-grid">
          {/* Main Info Column */}
          <div className="main-info">
            <section className="profile-section">
              <h3>About Company</h3>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  className="edit-textarea"
                  placeholder="Describe your company..."
                />
              ) : (
                <p className="description-text">{profile.description || "No description provided."}</p>
              )}
            </section>

            {isEditing && (
              <section className="profile-section">
                <h3>Update Branding</h3>
                <div className="edit-field">
                  <label>Logo URL</label>
                  <input
                    name="logo"
                    value={editForm.logo}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Sidebar Info */}
          <div className="side-info">
            <section className="profile-section details-card">
              <h3>Company Details</h3>
              
              <div className="detail-item">
                <FaGlobe className="icon" />
                <div className="detail-content">
                  <label>Website</label>
                  {isEditing ? (
                    <input name="website" value={editForm.website} onChange={handleChange} />
                  ) : (
                    <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FaMapMarkerAlt className="icon" />
                <div className="detail-content">
                  <label>Headquarters</label>
                  {isEditing ? (
                    <input name="location" value={editForm.location} onChange={handleChange} />
                  ) : (
                    <span>{profile.location || "N/A"}</span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FaUsers className="icon" />
                <div className="detail-content">
                  <label>Company Size</label>
                  {isEditing ? (
                    <select name="companySize" value={editForm.companySize} onChange={handleChange}>
                      <option value="">Select size...</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                  ) : (
                    <span>{profile.companySize || "N/A"}</span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FaCalendarAlt className="icon" />
                <div className="detail-content">
                  <label>Founded</label>
                  {isEditing ? (
                    <input name="foundedDate" value={editForm.foundedDate} onChange={handleChange} />
                  ) : (
                    <span>{profile.foundedDate || "N/A"}</span>
                  )}
                </div>
              </div>
            </section>

            <section className="profile-section social-card">
              <h3>Social Presence</h3>
              <div className="detail-item">
                <FaLinkedin className="icon linkedin" />
                <div className="detail-content">
                  <label>LinkedIn</label>
                  {isEditing ? (
                    <input name="linkedin" value={editForm.linkedin} onChange={handleChange} />
                  ) : (
                    profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noreferrer">View Profile</a> : "Not added"
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FaTwitter className="icon twitter" />
                <div className="detail-content">
                  <label>Twitter</label>
                  {isEditing ? (
                    <input name="twitter" value={editForm.twitter} onChange={handleChange} />
                  ) : (
                    profile.twitter ? <a href={profile.twitter} target="_blank" rel="noreferrer">View Profile</a> : "Not added"
                  )}
                </div>
              </div>
            </section>

            {!isEditing && (
              <button className="danger-btn" onClick={handleDelete}>
                <FaTrash /> Delete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}