import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ... keep your existing imports ...
import HomePage from "./common/HomePage";
import Signup from "./common/Signup";
import Login from "./common/Login";
import RegisterPage from "./Interviewer/RegisterPage";
import ApplicantRegistration from "./Applicant/ApplicantRegistration";
import EditProfile from "./Applicant/EditProfile";
import ApplicantDashboard from "./Applicant/ApplicantDashboard";
import NotificationsPage from "./Applicant/NotificationsPage";
import JobPosting from "./Applicant/JobPosting";
import InterviewPage from "./Applicant/InterviewPage";
import Profile from "./Applicant/Profile";



import Results from "./Applicant/Results";
import { DashboardLayout}  from "./Interviewer/DashboardLayout";
import { Dashboard } from "./Interviewer/Dashboard";
import { Notifications } from "./Interviewer/Notifications";
import { ProfileSettings } from "./Interviewer/ProfileSettings";
import { Candidates } from "./Interviewer/Candidates";
import { Jobposts } from "./Interviewer/Jobposts";

// =============== IMPROVED PROTECTED ROUTE ====================
function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check Role (Assuming your DB saves roles as 'applicant' and 'recruiter')
  // If the route requires a specific role, but the user doesn't have it...
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />; // Redirect to Home
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/applicantregister" element={<ApplicantRegistration/>}/>

        {/* ================= APPLICANT ROUTES ================= */}
        {/* We pass allowedRole="applicant" so recruiters can't see this */}
        <Route
          path="/ApplicantDashboard"
          element={
            <ProtectedRoute allowedRole="applicant">
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        />
        
<Route
  path="/profile"
  element={
    <ProtectedRoute allowedRole="applicant">
      <Profile />
    </ProtectedRoute>
  }
/>
        

        <Route 
          path="/EditProfile" 
          element={
            <ProtectedRoute allowedRole="applicant">
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        {/* Note: Grouping these makes code cleaner, but individual wraps work too */}
        <Route path="/notifications" element={<ProtectedRoute allowedRole="applicant"><NotificationsPage /></ProtectedRoute>} />
        <Route path="/JobPosting" element={<ProtectedRoute allowedRole="applicant"><JobPosting /></ProtectedRoute>} />
        <Route path="/InterviewPage" element={<ProtectedRoute allowedRole="applicant"><InterviewPage /></ProtectedRoute>} />
        <Route path="/Results" element={<ProtectedRoute allowedRole="applicant"><Results /></ProtectedRoute>} />
       
        {/* ================= RECRUITER ROUTES ================= */}
        {/* We pass allowedRole="recruiter" (or "interviewer" depending on your DB) */}
        <Route
          path="/InterviewerDashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes inside the Dashboard Layout */}
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<ProfileSettings />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="jobs" element={<Jobposts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

