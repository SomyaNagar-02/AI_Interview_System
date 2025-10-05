import React from 'react';
import './Notifications.css';

const sampleNotifications = [
  { id: 1, read: false, text: "New applicant for 'Frontend Developer': John Doe.", time: "5m ago" },
  { id: 2, read: false, text: "Candidate 'Jane Smith' has completed the AI interview.", time: "1h ago" },
  { id: 3, read: true, text: "Your new job post 'UX/UI Designer' is now live.", time: "Yesterday" },
  { id: 4, read: true, text: "Reminder: Interview with 'Peter Jones' is scheduled for tomorrow.", time: "Yesterday" },
];
export function Notifications() {
  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <button className="action-button">Mark all as read</button>
      </div>
      <ul className="notifications-list">
        {sampleNotifications.map(notif => (
          <li key={notif.id} className={notif.read ? 'read' : 'unread'}>
            <div className="notification-content">
              <span className="notification-dot"></span>
              <p>{notif.text}</p>
            </div>
            <span className="notification-time">{notif.time}</span>
          </li>
        ))}
      </ul>
    </div>

  );
}
