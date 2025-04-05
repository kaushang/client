import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; // Add this import

function SignUpForm({ switchForm }) {
  const navigate = useNavigate();
  const errorMessage = useRef(null);
  const email = useRef(null);
  const emailIcon = useRef(null);
  const username = useRef(null);
  const usernameIcon = useRef(null);
  const password = useRef(null);
  const passwordIcon = useRef(null);
  const nameIcon = useRef(null);
  const submitBtn = useRef(null);
  const { login } = useAuth(); // Add this to access the login function

  // keep tracks of each input fields in the form and stores the value of each field
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });

  // keep track of all the input fields and whether they are valid or not
  const [validFields, setValidFields] = useState({
    name: false,
    username: false,
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

      case "username":
        if (value.length === 0) {
          username.current.style.border = "";
          usernameIcon.current.style.display = "none";
          break;
        }

        const isValidUsername = value.length >= 4;
        username.current.style.border = isValidUsername ? "" : "2px solid red";
        usernameIcon.current.style.display = "block";

        usernameIcon.current.classList.toggle("icons-yes", isValidUsername);
        usernameIcon.current.classList.toggle(
          "fa-circle-check",
          isValidUsername
        );
        usernameIcon.current.classList.toggle("icons-no", !isValidUsername);
        usernameIcon.current.classList.toggle(
          "fa-circle-exclamation",
          !isValidUsername
        );

        if (!isValidUsername) {
          errorMessage.current.textContent =
            "Username must be at least 4 characters";
        }
        setValidFields((prev) => ({ ...prev, username: isValidUsername }));
        break;

      case "name":
        if (value.length > 0) {
          nameIcon.current.style.display = "block";
          nameIcon.current.classList.remove(
            "icons-no",
            "fa-circle-exclamation"
          );
          nameIcon.current.classList.add("icons-yes", "fa-circle-check");
        } else {
          nameIcon.current.style.display = "none";
        }
        setValidFields((prev) => ({ ...prev, name: value.length > 0 }));
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

  // useEffect: Checks whether all fields are filled and valid before enabling the submit button
  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (field) => field.trim() !== ""
    );
    const allFieldsValid = Object.values(validFields).every(
      (isValid) => isValid
    );

    if (allFieldsFilled && allFieldsValid) {
      submitBtn.current.removeAttribute("disabled");
      submitBtn.current.classList.remove("disable");
    } else {
      submitBtn.current.setAttribute("disabled", "true");
      submitBtn.current.classList.add("disable");
    }
  }, [formData, validFields]);

  //Create account function: Executes when submit button is clicked
  async function createAcc(event) {
    event.preventDefault();

    errorMessage.current.textContent = "";

    const url = "https://server-71hv.onrender.com/api/create";
    // const url = "/api/create";
    const data = {
      email: formData.email,
      username: formData.username,
      name: formData.username,
      password: formData.password,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await response.json();

    if (response.ok) {
      login(result.token); // Add this line to store the token
      navigate("/home");
    } else {
      errorMessage.current.textContent = result.message;
    }
  }

  return (
    <form className="form-section-child" action="" method="POST">
      <h1 className="heading">Create an account</h1>
      <section className="form-group">
        <input
          ref={email}
          required
          placeholder="Email"
          type="text"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <i
          ref={emailIcon}
          style={{ display: "none" }}
          className="icons-no fa-solid fa-circle-exclamation"
        ></i>
      </section>
      <section className="form-group">
        <input
          ref={username}
          required
          placeholder="Username"
          type="text"
          name="username"
          onChange={handleChange}
          value={formData.username}
        />
        <i
          ref={usernameIcon}
          style={{ display: "none" }}
          className="icons-no fa-solid fa-circle-exclamation"
        ></i>
      </section>
      <section className="form-group">
        <input
          required
          placeholder="Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={formData.name}
        />
        <i
          ref={nameIcon}
          style={{ display: "none" }}
          className="icons-yes fa-solid fa-circle-check"
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
          value={formData.password}
        />
        <i
          ref={passwordIcon}
          style={{ display: "none" }}
          className="icons-no fa-solid fa-circle-exclamation"
        ></i>
      </section>

      <span ref={errorMessage} id="errorMessage"></span>

      <input
        ref={submitBtn}
        className="disable submit-form"
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
