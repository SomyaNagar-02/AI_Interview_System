import "./RecruiterNotifications.css";

export default function RecruiterNotifications() {
  return (
    <div className="recruiter-notifications-page">
      <div className="notifications-container">
        <h1 className="notifications-title">Notifications</h1>
        <p className="notifications-subtitle">
          Stay updated on new applicants and job activity.
        </p>

        <div className="notification-item">
          <span className="notification-dot" />
          <div className="notification-text">
            New applicant applied for <b>Frontend Developer</b>
            <span className="notification-meta">Just now • Job ID #1234</span>
          </div>
        </div>

        {/* Example second item */}
        <div className="notification-item">
          <span className="notification-dot read" />
          <div className="notification-text">
            Interview scheduled with <b>John Doe</b> for <b>Backend Engineer</b>
            <span className="notification-meta">
              1 hour ago • 5:30 PM, Today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
