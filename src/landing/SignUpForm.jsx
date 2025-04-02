import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../AuthContext"; // Add this import

function SignUpForm({ switchForm }) {
  const navigate = useNavigate();
  const errorMessage = useRef(null);
  const { login } = useAuth(); // Add this to access the login function

  async function createAcc(event) {
    event.preventDefault();

    errorMessage.current.textContent = "";

    const submit = document.getElementById("submit");
    submit.removeAttribute("disabled");
    const url = "/api/create";
    const data = {
      email: document.querySelector('input[name="email"]').value,
      username: document.querySelector('input[name="username"]').value,
      name: document.querySelector('input[name="name"]').value,
      password: document.querySelector('input[name="password"]').value,
    };

    if (
      data.email === "" ||
      data.username === "" ||
      data.name === "" ||
      data.password === ""
    ) {
      return (errorMessage.current.textContent = "Please fill all the fields");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Store the token in auth context instead of just navigating
      login(result.token); // Add this line to store the token
      navigate("/home");
    } else {
      errorMessage.current.textContent = result.message;
    }
  }

  return (
    <form className="form-section-child" action="" method="POST">
      <h1 className="heading">Create an account</h1>

      <input required placeholder="Email" type="text" name="email" />

      <input required placeholder="Username" type="text" name="username" />

      <input required placeholder="Name" type="text" name="name" />

      <input required placeholder="Password" type="password" name="password" />

      <span ref={errorMessage} id="errorMessage"></span>

      <input
        className="submit-form"
        id="submit"
        onClick={createAcc}
        type="button"
        value="Create Account"
      />

      <p className="login">
        Already have an account? &nbsp;
        <strong>
          <a
            className="login"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchForm();
            }}
          >
            Log In
          </a>
        </strong>
      </p>
    </form>
  );
}

export default SignUpForm;
