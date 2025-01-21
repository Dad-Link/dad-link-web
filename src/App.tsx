// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./Auth/Signup";
import DadDashboard from "./pages/DadDashboard";
import ChildProfile from "./pages/ChildProfile"; // Corrected import path
import PrivateRoute from "./components/PrivateRoute"; // Imported correctly

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute><DadDashboard /></PrivateRoute>} />
        <Route path="/child-profile/:childId" element={<PrivateRoute><ChildProfile /></PrivateRoute>} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
