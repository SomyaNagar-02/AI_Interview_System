import React, { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import "./Signup.css";
import { useApp } from "../context/AppContext";

export default function Signup() {
  const { user, setUser } = useApp();
  const navigation=useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Immediate Auto-Redirection for already logged-in users
  useEffect(() => {
    if (user) {
      if (user.role === 'recruiter') {
        navigation('/recruiter');
      } else if (user.role === 'applicant') {
        navigation('/ApplicantDashboard');
      }
    }
  }, [user, navigation]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
const handlesubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "/api/v1/auth/register",
      {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      },
      { withCredentials: true } // <-- IMPORTANT
    );

    console.log("Signup success:", res.data);

    const registeredUser = res.data.data.user;
    
    localStorage.setItem("user", JSON.stringify(registeredUser));
    localStorage.setItem("token", res.data.data.accessToken);
    localStorage.setItem("accessToken", res.data.data.accessToken);

    // Update global context state so that it persists and propagates instantly
    setUser(registeredUser);
  

    // redirect based on role
    if (form.role === "recruiter") {
      navigation("/register");  // Recruiter Profile form
    } else if (form.role === "applicant") {
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
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button type="submit" onClick={handlesubmit}>Sign Up</button>
      </form>
    </div>
  );
}