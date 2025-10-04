
import React, { useState } from "react";
import "./EditProfile.css";

export default function ApplicantProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    country: "",
    dob: "",
    skills: "",
    experience: "",
    education: "",
    linkedin: "",
    summary: "",
    photo: ""
  });

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "photo" ? files[0] : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Save form logic here
    alert("Profile updated!");
  };

  return (
    <div className="profile-root">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>
        <div className="profile-photo-section">
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="photo-upload"
          />
          <div className="photo-circle">
            {form.photo ? (
              <img src={URL.createObjectURL(form.photo)} alt="Profile" className="photo-preview" />
            ) : (
              <span role="img" aria-label="avatar">👤</span>
            )}
          </div>
        </div>
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location (City, State)" value={form.location} onChange={handleChange} required />
        <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
        <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} />
        <input type="text" name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
        <textarea name="summary" placeholder="Short professional summary" value={form.summary} onChange={handleChange} rows={2} />
        <textarea name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} rows={2} />
        <textarea name="education" placeholder="Education" value={form.education} onChange={handleChange} rows={2} />
        <input type="url" name="linkedin" placeholder="LinkedIn Profile" value={form.linkedin} onChange={handleChange} />
        <button type="submit" className="profile-btn">Save Profile</button>
      </form>
    </div>
  );
}
