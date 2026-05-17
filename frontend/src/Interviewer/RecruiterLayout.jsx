import { Link, Outlet } from "react-router-dom";
import "./RecruiterLayout.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPlusCircle, FiBell, FiTrendingUp, FiUser, FiLogOut, FiGrid, FiSun, FiMoon } from "react-icons/fi";
import { useApp } from "../context/AppContext.jsx";

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const { logout, darkMode, toggleDarkMode } = useApp();

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/auth/logout",
        {},
        { withCredentials: true }   
      );

      logout();
      navigate("/");  
    } catch (err) {
      console.error("Logout failed", err);
      // Fallback logout in case server fails
      logout();
      navigate("/");
    }
  };

  return (
    <div className="recruiter-layout">
      <nav className="recruiter-navbar">
        <div className="logo">SelectX</div>

        <div className="nav-right">
          <Link to="/recruiter">
            <FiGrid className="nav-icon" /> Dashboard
          </Link>
          <Link to="/recruiter/post-job">
            <FiPlusCircle className="nav-icon" /> Post Job
          </Link>
          <Link to="/recruiter/notifications">
            <FiBell className="nav-icon" /> Notifications
          </Link>
          <Link to="/recruiter/results">
            <FiTrendingUp className="nav-icon" /> Results
          </Link>
          <Link to="/recruiter/profile">
            <FiUser className="nav-icon" /> Profile
          </Link>
          
          {/* Theme Toggler */}
          <button onClick={toggleDarkMode} className="theme-toggle-btn" aria-label="Toggle Theme">
            {darkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          </button>

          <button onClick={handleLogout} className="logout">
            <FiLogOut className="logout-icon" /> Logout
          </button>
        </div>
      </nav>

      <div className="recruiter-content">
        <Outlet />
      </div>
    </div>
  );
}
