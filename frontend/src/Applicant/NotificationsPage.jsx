import React from "react";
import "./NotificationsPage.css";

const notifications = [
  { 
    id: 1,
    type: "interview", 
    message: "Frontend Developer interview scheduled for Oct 15, 11:00 AM", 
    time: "5m ago"
  },
  { 
    id: 2,
    type: "result", 
    message: "Result: UI Designer interview – Rejected", 
    time: "2h ago"
  },
  { 
    id: 3,
    type: "status", 
    message: "Application for Backend Engineer – ATS screening passed", 
    time: "Yesterday"
  }
];

export default function NotificationsPage() {
  return (
    <div className="notif-root">
      <div className="notif-header">
        <span role="img" aria-label="bell">🔔</span>
        Notifications
      </div>
      <div className="notif-list">
        {notifications.map(n => (
          <div className={`notif-card ${n.type}`} key={n.id}>
            <div className="notif-message">{n.message}</div>
            <span className="notif-time">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
