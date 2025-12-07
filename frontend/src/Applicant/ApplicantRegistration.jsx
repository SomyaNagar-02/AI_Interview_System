import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ApplicantRegistration.css";

function ApplicantRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      await axios.post(`${API_BASE_URL}/applicant/create`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Profile created successfully!");
      navigate("/ApplicantDashboard");
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.message || "Failed to create profile");
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-box">
        <div className="reg-header">
          <h1>Complete Your Profile</h1>
          <p>Help us find the perfect job matches for you</p>
        </div>

        <form onSubmit={handleSubmit} className="reg-form">
          <div className="section">
            <h2>Basic Information</h2>
            
            <div className="row">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Personal Information</h2>
            
            <div className="row">
              <div className="field">
                <label>City, State *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Bangalore, Karnataka"
                  required
                />
              </div>

              <div className="field">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., India"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="section">
            <h2>Professional Information</h2>

            <div className="field">
              <label>Professional Summary *</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief overview of your background and goals..."
                rows="4"
                required
              />
            </div>

            <div className="field">
              <label>Skills *</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js (comma separated)"
                required
              />
              <span className="hint">Separate skills with commas</span>
            </div>

            <div className="field">
              <label>Work Experience *</label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your work experience, roles..."
                rows="5"
                required
              />
            </div>

            <div className="field">
              <label>Education *</label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Your degrees, institutions..."
                rows="4"
                required
              />
            </div>

            <div className="field">
              <label>Projects (Optional)</label>
              <textarea
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                placeholder="List your projects (comma separated)"
                rows="3"
              />
              <span className="hint">Separate projects with commas</span>
            </div>

            <div className="field">
              <label>LinkedIn Profile (Optional)</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div className="actions">
            <button type="button" onClick={() => navigate("/ApplicantDashboard")} className="skip-btn">
              Skip for Now
            </button>
            <button type="submit" className="submit-btn">
              Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicantRegistration;


