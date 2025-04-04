import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../AuthContext"; // Add this import

function SignUpForm({ switchForm }) {
  const navigate = useNavigate();
  const errorMessage = useRef(null);
  const email = useRef(null);
  const username = useRef(null);
  const password = useRef(null);
  const { login } = useAuth(); // Add this to access the login function
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });

  // const [errorMessage, setErrors] = useState({});

  // const validate = (name, value) => {
  //   errorMessage.current.textContent = "";

  //   switch (name) {
  //     case "email":
  //         if (!/^\S+@\S+\.\S+$/.test(value)) {
  //           return (errorMessage.current.textContent = "Invalid email address");
  //         }
  //         break;
  //     case "username":
  //       if (value.length < 4) {
  //         return (errorMessage.current.textContent = "Username must be at least 4 characters");
  //       }
  //       break;
  //       case "password":
  //         if (value.length < 6) {
  //         return (errorMessage.current.textContent = "Password must be at least 6 characters");
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // validate(name, value);
  };

  async function createAcc(event) {
    event.preventDefault();

    errorMessage.current.textContent = "";

    const submit = document.getElementById("submit");
    submit.removeAttribute("disabled");
    const url = "https://server-71hv.onrender.com/api/create";
    // const url = "/api/create";
    const data = {
      email: formData.email,
      username: formData.username,
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

      <input
      ref={email}
        required
        placeholder="Email"
        type="text"
        name="email"
        onChange={handleChange}
        value={formData.email}
      />

      <input
      ref={username}
        required
        placeholder="Username"
        type="text"
        name="username"
        onChange={handleChange}
        value={formData.username}
      />
      {/* <i class="fa-solid fa-circle-exclamation"></i> */}
      {/* <i class="fa-solid fa-circle-check"></i> */}

      <input required placeholder="Name" type="text" name="name" onChange={handleChange} value={formData.name}/>

      <input
      ref={password}
        required
        placeholder="Password"
        type="password"
        name="password"
        onChange={handleChange}
        value={formData.password}
      />

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
