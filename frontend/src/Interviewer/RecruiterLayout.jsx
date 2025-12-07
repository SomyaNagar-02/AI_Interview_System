import { Link, Outlet } from "react-router-dom";
import "./RecruiterLayout.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function RecruiterLayout() {
    const navigate=useNavigate();
    const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        {},
        { withCredentials: true }   
      );

    
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");  
    } catch (err) {
      console.error("Logout failed", err);
    }
}
  return (
    <div className="recruiter-layout">
      <nav className="recruiter-navbar">
        <div className="logo">SelectX</div>

        <div className="nav-right">
          <Link to="/recruiter/post-job">+ Post New Job</Link>
          <Link to="/recruiter/notifications">Notifications</Link>
          <Link to="/recruiter/profile">Profile</Link>
          <button onClick={handleLogout} className="logout">
  Logout
</button>
        </div>
      </nav>

      <div className="recruiter-content">
        <Outlet />
      </div>
    </div>
  );
}
