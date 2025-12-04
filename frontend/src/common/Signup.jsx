import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import "./Signup.css";

export default function Signup() {
    const navigation=useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
const handlesubmit = async (e) => {
  e.preventDefault();

  try {
  
    const res = await axios.post("http://localhost:5000/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    console.log("Signup success:");

 
    if (form.role === "Selector") {
      navigation("/register");
    }
    if (form.role === "Applicant") {
      navigation("/applicantregister");
    }
  } catch (err) {
    console.error("Signup error:", err);
    alert("Signup failed");
  }
};

  return (
    <div className="signup-container">
      <form className="signup-card">
        <h2>Create Your Account</h2>

        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="yourname@example.com"
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          onChange={handleChange}
        />

        <label>Role</label>
        <select name="role" onChange={handleChange}>
          <option value="">Select role</option>
          <option value="Applicant">Applicant</option>
          <option value="Selector">Selector</option>
        </select>

        <button type="submit" onClick={handlesubmit}>Sign Up</button>
      </form>
    </div>
  );
}