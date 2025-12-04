import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    location: "",
    country: "",
    dob: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
    summary: "",
    linkedin: ""
  });

  const API_BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/applicant/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data;
      
      setFormData({
        location: data.location || "",
        country: data.country || "",
        dob: data.dob || "",
        skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
        experience: data.experience || "",
        education: data.education || "",
        projects: Array.isArray(data.projects) ? data.projects.join(", ") : "",
        summary: data.summary || "",
        linkedin: data.linkedin || ""
      });

      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      
      const dataToSend = {
        location: formData.location,
        country: formData.country,
        dob: formData.dob,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s),
        experience: formData.experience,
        education: formData.education,
        projects: formData.projects.split(",").map(p => p.trim()).filter(p => p),
        summary: formData.summary,
        linkedin: formData.linkedin
      };

      await axios.put(`${API_BASE_URL}/applicant/edit`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaving(false);
    }
  };

  

  return (
    <div className="edit-profile-wrapper">
      <div className="edit-profile-container">
        <div className="edit-profile-card">
          <h1 className="edit-profile-title">Edit Profile</h1>
          
          <button 
            onClick={() => navigate("/profile")} 
            className="back-to-profile-btn"
          >
            ← Back to Profile
          </button>

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="location">Location (City, State)</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., United States"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn Profile URL</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills (comma separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js"
              />
              <small>Separate each skill with a comma</small>
            </div>

            <div className="form-group">
              <label htmlFor="summary">Professional Summary</label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="4"
                placeholder="Write a brief professional summary about yourself"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Experience</label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="5"
                placeholder="Describe your work experience"
              />
            </div>

            <div className="form-group">
              <label htmlFor="education">Education</label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your educational background"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projects">Projects (comma separated)</label>
              <textarea
                id="projects"
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                rows="4"
                placeholder="List your projects, separated by commas"
              />
              <small>Separate each project with a comma</small>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate("/profile")} 
                className="cancel-btn"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;


