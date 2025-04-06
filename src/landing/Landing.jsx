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

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("https://server-71hv.onrender.com/api/auth", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          navigate("/home", { state: { from: location }, replace: true });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the authentication check function
    checkAuthentication();
  }, [navigate, location]);

  return (
    <div className="auth">
      <nav>
        <h1 id="logo" className="tag-line">
          memoir
        </h1>
      </nav>
      <div className="form-section">
        <div className="form-section-child">
          <h2 id="site-name">memoir</h2>
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
