import React, { useState } from "react";
import "./EditProfile.css";
import axios from "axios";


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
    summary: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.put(
      "http://localhost:8000/api/v1/applicant/edit",
      form,
      { withCredentials: true }
    );

    alert("Profile Updated Successfully!");

  } catch (err) {
    alert(err.response?.data?.message || "Error updating profile");
  }
};


  return (
    <div className="profile-root">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>

        {/* START FROM FULL NAME DIRECTLY */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location (City, State)"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
        />

        <textarea
          name="summary"
          placeholder="Short professional summary"
          value={form.summary}
          onChange={handleChange}
          rows={2}
        />

        <textarea
          name="experience"
          placeholder="Experience"
          value={form.experience}
          onChange={handleChange}
          rows={2}
        />

        <textarea
          name="education"
          placeholder="Education"
          value={form.education}
          onChange={handleChange}
          rows={2}
        />

        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn Profile"
          value={form.linkedin}
          onChange={handleChange}
        />

        <button type="submit" className="profile-btn">Save Profile</button>
      </form>
    </div>
  );
}
