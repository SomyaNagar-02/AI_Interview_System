import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./common/HomePage";
import RegisterPage from "./Interviewer/RegisterPage"
import EditProfile from "./Applicant/EditProfile";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL to login page */}
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/EditProfile" element={<EditProfile/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
