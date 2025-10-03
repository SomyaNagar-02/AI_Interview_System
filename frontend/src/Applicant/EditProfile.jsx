import React, { useState } from "react";
import "./EditProfile.css";

const EditProfileApplicant = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    password: "",
    skills: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    alert("Profile updated");
  };

  return (
    <div className="editprofile-bg">
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-form-header">
          <h2>Edit Profile</h2>
          <button
            type="button"
            className="close-btn"
            onClick={() => window.history.back()}
            title="Close"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleChange}
          autoComplete="off"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          autoComplete="off"
          required
        />

        <div className="checkbox-group">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I confirm my information is correct and agree to the privacy policy.
          </label>
        </div>

        <button type="submit" className="profile-btn">
          SAVE CHANGES
        </button>

        <div className="profile-form-footer">
          <span>Back to dashboard</span>
        </div>
      </form>
    </div>
  );
};

export default EditProfileApplicant;
