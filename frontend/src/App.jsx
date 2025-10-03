import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./common/HomePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL to login page */}
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<HomePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
