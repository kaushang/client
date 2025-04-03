import React, { useState, useEffect } from "react";
import "../App.css";
import SignUpForm from "./SignUpForm";
import LogInForm from "./LogInForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSignUp, setShowSignUp] = useState(true);

  return (
    <div className="auth">
      <nav>
        <h1 id="logo" className="tag-line">
          memoir
        </h1>
      </nav>
      <div className="form-section">
        <div className="form-section-child">
          <p id="site-name">memoir</p>
          <p className="tag-line">Your thoughts, Your space</p>
        </div>
        {showSignUp ? (
          <SignUpForm switchForm={() => setShowSignUp(false)} />
        ) : (
          <LogInForm switchForm={() => setShowSignUp(true)} />
        )}
      </div>
    </div>
  );
}

export default Landing;