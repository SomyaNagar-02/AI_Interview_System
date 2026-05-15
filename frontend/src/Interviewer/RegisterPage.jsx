import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const InterviewerRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.website.trim()) newErrors.website = "Website is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await axios.post("/api/v1/recruiter/setRecruiterDetails", formData, {
        withCredentials: true,
      });

      alert("Recruiter profile created!");
      navigate("/recruiter");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save recruiter details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Registerpage-bg">
      <div className="registration-root">
        <form className="registration-form" onSubmit={handleSubmit} noValidate>
          <div className="reg-header">
            <h2>Complete Company Profile</h2>
            <p>Tell us more about your organization to get started.</p>
          </div>

          <div className="form-section">
            <h3 className="section-title">Core Information</h3>
            <div className="field-group">
              <div className="field">
                <label>Company Name *</label>
                <input
                  name="companyName"
                  type="text"
                  placeholder="SelectX Labs"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={errors.companyName ? "input-error" : ""}
                />
                {errors.companyName && <span className="error-text">{errors.companyName}</span>}
              </div>

              <div className="field">
                <label>Website *</label>
                <input
                  name="website"
                  type="url"
                  placeholder="https://selectx.ai"
                  value={formData.website}
                  onChange={handleChange}
                  className={errors.website ? "input-error" : ""}
                />
                {errors.website && <span className="error-text">{errors.website}</span>}
              </div>
            </div>

            <div className="field">
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Briefly describe your company's mission and culture..."
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "input-error" : ""}
                rows="4"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Operations</h3>
            <div className="field-group">
              <div className="field">
                <label>Headquarters *</label>
                <input
                  name="location"
                  type="text"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? "input-error" : ""}
                />
                {errors.location && <span className="error-text">{errors.location}</span>}
              </div>

              <div className="field">
                <label>Industry *</label>
                <input
                  name="industry"
                  type="text"
                  placeholder="e.g. Technology / SaaS"
                  value={formData.industry}
                  onChange={handleChange}
                  className={errors.industry ? "input-error" : ""}
                />
                {errors.industry && <span className="error-text">{errors.industry}</span>}
              </div>
            </div>

            <div className="field-group">
              <div className="field">
                <label>Company Size</label>
                <select name="companySize" value={formData.companySize} onChange={handleChange}>
                  <option value="">Select size...</option>
                  <option value="1-10">1-10 Employees</option>
                  <option value="11-50">11-50 Employees</option>
                  <option value="51-200">51-200 Employees</option>
                  <option value="201-500">201-500 Employees</option>
                  <option value="501-1000">501-1000 Employees</option>
                  <option value="1000+">1000+ Employees</option>
                </select>
              </div>

              <div className="field">
                <label>Founded Date</label>
                <input
                  name="foundedDate"
                  type="text"
                  placeholder="e.g. Jan 2020"
                  value={formData.foundedDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Social & Branding</h3>
            <div className="field-group">
              <div className="field">
                <label>LinkedIn URL</label>
                <input
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/company/..."
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label>Twitter URL</label>
                <input
                  name="twitter"
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={formData.twitter}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label>Logo URL (Optional)</label>
              <input
                name="logo"
                type="url"
                placeholder="https://link-to-your-logo.png"
                value={formData.logo}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Saving..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewerRegistration;