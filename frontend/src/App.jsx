import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./common/HomePage";
import RegisterPage from "./Interviewer/RegisterPage"
import EditProfile from "./Applicant/EditProfile";
import ApplicantDashboard from "./Applicant/ApplicantDashboard";
import NotificationsPage from "./Applicant/NotificationsPage";
import JobPosting from "./Applicant/JobPosting"
import InterviewPage from "./Applicant/InterviewPage";
import Results from "./Applicant/Results";
import { DashboardLayout } from './Interviewer/DashboardLayout';
import { Dashboard } from './Interviewer/Dashboard';
import {Notifications} from './Interviewer/Notifications';
import {ProfileSettings} from './Interviewer/ProfileSettings';
import { Candidates } from './Interviewer/Candidates';
import { Jobposts } from './Interviewer/Jobposts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL to login page */}
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/EditProfile" element={<EditProfile/>} />
        <Route path="/ApplicantDashboard" element={<ApplicantDashboard/>} />
       <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/JobPosting" element={<JobPosting/>} />
        <Route path="/InterviewPage" element={<InterviewPage/>} />
        <Route path="/Results" element={<Results/>} />
        <Route path="/InterviewerDashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="candidates" element={<Candidates/>} />
          <Route path="jobs" element={<Jobposts/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
