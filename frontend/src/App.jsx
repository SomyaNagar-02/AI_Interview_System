import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Common
import HomePage from "./common/HomePage";
import Signup from "./common/Signup";
import Login from "./common/Login";

// Applicant
import RegisterPage from "./Interviewer/RegisterPage";
import ApplicantRegistration from "./Applicant/ApplicantRegistration";
import EditProfile from "./Applicant/EditProfile";
import ApplicantDashboard from "./Applicant/ApplicantDashboard";
import NotificationsPage from "./Applicant/NotificationsPage";
import JobPosting from "./Applicant/JobPosting";
import InterviewPage from "./Applicant/InterviewPage";
import Profile from "./Applicant/Profile";
import Results from "./Applicant/Results";

// Recruiter
// Recruiter (Interviewer Folder)
import RecruiterLayout from "./Interviewer/RecruiterLayout";
import RecruiterDashboard from "./Interviewer/RecruiterDashboard";
import PostJob from "./Interviewer/PostJob";
import RecruiterNotifications from "./Interviewer/RecruiterNotifications";
import RecruiterProfile from "./Interviewer/RecruiterProfile";
import ApplicantsList from "./Interviewer/ApplicantsList";
import ViewApplicant from "./Interviewer/ViewApplicant";


// =============== PROTECTED ROUTE ====================
function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/applicantregister" element={<ApplicantRegistration />} />


        {/* ====================== APPLICANT ROUTES ====================== */}
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

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRole="applicant">
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/JobPosting"
          element={
            <ProtectedRoute allowedRole="applicant">
              <JobPosting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/InterviewPage"
          element={
            <ProtectedRoute allowedRole="applicant">
              <InterviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Results"
          element={
            <ProtectedRoute allowedRole="applicant">
              <Results />
            </ProtectedRoute>
          }
        />


        {/* ====================== RECRUITER ROUTES ====================== */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard = front page */}
          <Route index element={<RecruiterDashboard />} />

          {/* + Post new job */}
          <Route path="post-job" element={<PostJob />} />

          {/* Notifications */}
          <Route path="notifications" element={<RecruiterNotifications />} />

          {/* Profile */}
          <Route path="profile" element={<RecruiterProfile />} />

          {/* Applicants List inside job */}
          <Route path="applicants/:jobId" element={<ApplicantsList />} />

          {/* Single Applicant */}
          <Route path="applicant/:id" element={<ViewApplicant />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
