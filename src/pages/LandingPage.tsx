import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page, index) => {
      setTimeout(() => {
        page.classList.add("flip");
      }, index * 1000); // Delay each page flip
    });
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      {/* Book with flipping pages */}
      <div className="book">
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
        <div className="page"></div>
      </div>

      <h1 className="book-title">Easy Blog</h1>
      <button className="get-started-button" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;
