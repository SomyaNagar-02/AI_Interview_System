import { useNavigate } from "react-router-dom";
import "./InterviewCompleted.css";

export default function InterviewCompleted() {
  const navigate = useNavigate();

  return (
    <div className="completed-page">
      <div className="completed-card">
        <div className="completed-icon">✅</div>
        <h1 className="completed-title">Interview Completed!</h1>
        <p className="completed-subtitle">
          Thank you for your time. Your interview has been successfully recorded
          and is being evaluated.
        </p>
        <p className="completed-note">
          You will be notified via email once the results are ready. Please
          check your inbox in the coming hours.
        </p>
        <button className="home-btn" onClick={() => navigate("/ApplicantDashboard")}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
