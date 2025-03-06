// src/components/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <h1 className="title">GuardedWords</h1>
      <button className="get-started-button" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
