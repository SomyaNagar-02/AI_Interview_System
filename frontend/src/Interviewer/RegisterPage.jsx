import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const InterviewerRegistration = () => {
  const navigation=useNavigate();
  const [formData, setFormData] = useState({
  companyName: "",
  description: "",
  website: "",
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

  if (!formData.companyName.trim())
    newErrors.companyName = "Company name is required";

  if (!formData.description.trim())
    newErrors.description = "Description is required";

  if (!formData.website.trim())
    newErrors.website = "Website is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:8000/api/v1/recruiter/setRecruiterDetails",
      {
        companyName: formData.companyName,
        description: formData.description,
        website: formData.website,
      },
      { withCredentials: true }
    );

    alert("Recruiter profile created!");
    navigation("/login");
  } catch (err) {
    console.error(err);
    alert("Failed to save recruiter details");
  }
};

  return (
    <div className="Registerpage-bg">
    <div className="registration-root">
      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        <h2>Register Here</h2>

        <label>Company Name</label>
        <input
          name="companyName"
          type="text"
          placeholder="SelectX Labs"
          value={formData.companyName}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          placeholder="About your company…"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Website</label>
        <input
          name="website"
          type="text"
          placeholder="https://example.com"
          value={formData.website}
          onChange={handleChange}
        />

        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
    </div>
  );
};

export default InterviewerRegistration;