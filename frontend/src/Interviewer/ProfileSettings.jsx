import React from 'react';
import './ProfileSettings.css';

export function ProfileSettings() {
  return (
    <div className="profile-settings-page">
      <h1>Profile Settings</h1>
      <div className="settings-form">
        <section className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" defaultValue="Admin Recruiter" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" defaultValue="admin@recruiterai.com" />
          </div>
        </section>

        <section className="form-section">
          <h2>Change Password</h2>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" />
          </div>
        </section>

        <button className="action-button primary">Save Changes</button>
      </div>
    </div>
  );
}
