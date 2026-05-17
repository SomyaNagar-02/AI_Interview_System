import { useState, useEffect } from "react";
import axios from "axios";
import "./RecruiterNotifications.css";

export default function RecruiterNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/notification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/api/v1/notification/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="recruiter-notifications-page">
      <div className="notifications-container">
        <h1 className="notifications-title">Notifications</h1>
        <p className="notifications-subtitle">
          Stay updated on new applicants and job activity.
        </p>

        {loading ? (
          <div className="notifications-loading">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => (
              <div 
                key={n._id} 
                className={`notification-item ${n.isRead ? "read" : ""}`}
                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                style={{ cursor: n.isRead ? "default" : "pointer" }}
              >
                <span className={`notification-dot ${n.isRead ? "read" : ""}`} />
                <div className="notification-text">
                  <p className="notification-message" dangerouslySetInnerHTML={{ __html: n.message }} />
                  <span className="notification-meta">
                    {formatDate(n.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
