import React from 'react';
import { Link, Outlet } from 'react-router-dom'; 
import "./Dashboard.css";

export function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h3>Interviewer</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/InterviewerDashboard" className="nav-item">📊 Dashboard</Link>
                    <Link to="/InterviewerDashboard/jobs" className="nav-item">💼 Job Postings</Link>
                    <Link to="/InterviewerDashboard/candidates" className="nav-item">👥 Candidates</Link>
                    <Link to="/InterviewerDashboard/notifications" className="nav-item">🔔 Notifications</Link>
                    <Link to="/InterviewerDashboard/settings" className="nav-item">⚙️ Profile Settings</Link>
                </nav>
            </aside>

            <main className="main-panel">
                <Outlet />
            </main>
        </div>
    );
}