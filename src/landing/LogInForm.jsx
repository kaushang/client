import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // Add this import

function LogInForm({ switchForm }) {
  const navigate = useNavigate();
  const errorMessage = useRef(null);
  const email = useRef(null);
  const emailIcon = useRef(null);
  const password = useRef(null);
  const passwordIcon = useRef(null);
  const submitBtn = useRef(null);
  const { login } = useAuth(); // Add this to access the login function
  const [loading, setLoading] = useState(false); // Add loading state

  // keep tracks of each input fields in the form and stores the value of each field
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // keep track of all the input fields and whether they are valid or not
  const [validFields, setValidFields] = useState({
    email: false,
    password: false,
  });

  // Validate function: Checks whether each field is valid or not
  const validate = (name, value) => {
    errorMessage.current.textContent = "";

    switch (name) {
      case "email":
        if (value.length === 0) {
          email.current.style.border = "";
          emailIcon.current.style.display = "none";
          break;
        }

        const isValidEmail = /^\S+@\S+\.\S+$/.test(value);
        email.current.style.border = isValidEmail ? "" : "2px solid red";
        emailIcon.current.style.display = "block";

        emailIcon.current.classList.toggle("icons-yes", isValidEmail);
        emailIcon.current.classList.toggle("fa-circle-check", isValidEmail);
        emailIcon.current.classList.toggle("icons-no", !isValidEmail);
        emailIcon.current.classList.toggle(
          "fa-circle-exclamation",
          !isValidEmail
        );

        if (!isValidEmail) {
          errorMessage.current.textContent = "Enter a valid email";
        }
        setValidFields((prev) => ({ ...prev, email: isValidEmail }));
        break;

      case "password":
        if (value.length === 0) {
          password.current.style.border = "";
          passwordIcon.current.style.display = "none";
          break;
        }

        const isValidPassword = value.length >= 6;
        password.current.style.border = isValidPassword ? "" : "2px solid red";
        passwordIcon.current.style.display = "block";

        passwordIcon.current.classList.toggle("icons-yes", isValidPassword);
        passwordIcon.current.classList.toggle(
          "fa-circle-check",
          isValidPassword
        );
        passwordIcon.current.classList.toggle("icons-no", !isValidPassword);
        passwordIcon.current.classList.toggle(
          "fa-circle-exclamation",
          !isValidPassword
        );

        if (!isValidPassword) {
          errorMessage.current.textContent =
            "Password must be at least 6 characters";
        }
        setValidFields((prev) => ({ ...prev, password: isValidPassword }));
        break;

      default:
        break;
    }
  };

  // Handle changes of values: Updates values after every change
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validate(name, value);
  };

  // useEffect to check if all fields are filled and valid
  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (field) => field.trim() !== ""
    );
    const allFieldsValid = Object.values(validFields).every(
      (isValid) => isValid
    );

    if (allFieldsValid && allFieldsFilled) {
      submitBtn.current.removeAttribute("disabled");
      submitBtn.current.classList.remove("disable");
    } else {
      submitBtn.current.setAttribute("disabled", "true");
      submitBtn.current.classList.add("disable");
    }
  }, [formData, validFields]);

  async function check(event) {
    event.preventDefault();
    setLoading(true); // Show loading animation
    submitBtn.current.setAttribute("disabled", true); // Disable the button
    errorMessage.current.textContent = "";
    const url = "https://server-71hv.onrender.com/api/login";
    // const url = "/api/login";

    const data = {
      email: formData.email,
      password: formData.password,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();
      if (response.ok) {
        console.log("user verified");
        login(result.token); // Add this line to store the token
        navigate("/home");
      } else {
        errorMessage.current.textContent = result.message;
      }
    } catch (error) {
      errorMessage.current.textContent =
        "Something went wrong. Please try again.";
    } finally {
      setLoading(false); // Stop loading animation
      submitBtn.current.removeAttribute("disabled"); // Re-enable button
    }
  }

  return (
    <form className="form-section-child" action="/login" method="POST">
      <h1 className="heading">Log In</h1>
      <section className="form-group">
        <input
          ref={email}
          required
          placeholder="Email"
          type="text"
          name="email"
          onChange={handleChange}
        />
        <i
          ref={emailIcon}
          style={{ display: "none" }}
          className="icons-no fa-solid fa-circle-exclamation"
        ></i>
      </section>

      <section className="form-group">
        <input
          ref={password}
          required
          placeholder="Password"
          type="password"
          name="password"
          onChange={handleChange}
        />
        <i
          ref={passwordIcon}
          style={{ display: "none" }}
          className="icons-no fa-solid fa-circle-exclamation"
        ></i>
      </section>

      <span ref={errorMessage} id="errorMessage"></span>

      <button
        ref={submitBtn}
        className="submit-form"
        onClick={check}
        id="submit"
        type="button"
        disabled={loading}
      >
        {loading ? <div className="spinner inside-btn"></div> : "Log In"}
      </button>

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
