import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="app-navbar">
      <div className="nav-container">
        <h1 className="nav-logo">SelectX</h1>

        <div className="nav-links">
          <a href="/jobs" className="nav-link active">Jobs</a>
          <a href="/profile" className="nav-link">Profile</a>
          <a href="/notifications" className="nav-link">Notifications</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
