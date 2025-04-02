import React from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../AuthContext"; // Add this import

function LogInForm({ switchForm }) {
  const navigate = useNavigate();
  const errorMessage = useRef(null);
  const { login } = useAuth(); // Add this to access the login function

  async function check(event) {
    event.preventDefault();

    errorMessage.current.textContent = "";
    const data = {
      email: document.querySelector('input[name="email"]').value,
      password: document.querySelector('input[name="password"]').value,
    };
    if (data.email === "" || data.password === "") {
      return (errorMessage.current.textContent = "Please fill all the fields");
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("user verified");
      // Store the token in auth context instead of just navigating
      login(result.token); // Add this line to store the token
      navigate("/home");
    } else {
      errorMessage.current.textContent = result.message;
    }
  }

  return (
    <form className="form-section-child" action="/login" method="POST">
      <h1 className="heading">Log In</h1>

      <input required placeholder="Email" type="text" name="email" />

      <input required placeholder="Password" type="password" name="password" />

      <span ref={errorMessage} id="errorMessage"></span>

      <input
        className="submit-form"
        onClick={check}
        id="submit"
        type="button"
        value="Log In"
      />

      <p className="login">
        Don't have an account? &nbsp;
        <strong>
          <a
            className="login"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchForm();
            }}
          >
          Sign Up
          </a>
        </strong>
      </p>
    </form>
  );
}

export default LogInForm;
