import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiSun, FiMoon } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, darkMode, toggleDarkMode } = useApp();
  const API_BASE_URL = "/api/v1";


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Call backend logout endpoint
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      // Clear local storage & global app context
      logout();
      
      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, clear local storage & global app context and redirect
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="app-navbar">
      <div className="nav-container">
        <h1 className="nav-logo" onClick={() => navigate("/ApplicantDashboard")}>
          SelectX
        </h1>

        <div className="nav-links">
          <Link to="/ApplicantDashboard" className="nav-link">Jobs</Link>
          {/* <Link to="/my-applications" className="nav-link">My Applications</Link> */}
          <Link to="/notifications" className="nav-link">Notifications</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          
          {/* Theme Toggler */}
          <button onClick={toggleDarkMode} className="theme-toggle-btn" aria-label="Toggle Theme">
            {darkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          </button>

          <button onClick={handleLogout} className="logout-btn">
            <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

