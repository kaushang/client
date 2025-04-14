import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreatePostBtn from "./CreatePostBtn";
import HomeBtn from "./HomeBtn";
import { useAuth } from "./AuthContext";

export default function Nav(props) {
  const modal = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  function toggleMenu(event) {
    event.stopPropagation();
    closeAllMenus();
    const menuContainer = event.target.closest(".menu-container");
    const dropdown = menuContainer.querySelector(".menu-dropdown");
    dropdown.classList.toggle("show");
  }

  function closeAllMenus() {
    document.querySelectorAll(".menu-dropdown").forEach((menu) => {
      menu.classList.remove("show");
    });
  }

  document.addEventListener("click", function (event) {
    closeAllMenus();
  });

  function logoutBox(event) {
    event.preventDefault();
    modal.current.style.display = "block";
    modal.current.classList.add("fadeIn");
  }
  window.addEventListener("click", (e) => {
    if (e.target === modal.current) {
      close(); // Close the modal if clicked outside
    }
  });
  async function handleLogout() {
    const response = await fetch("https://server-71hv.onrender.com/api/logout", {
    // const response = await fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("Response: ", response);
    const data = await response.json();
    console.log("Data: ", data);

    if (response.ok) {
      logout();
      // navigate("/");
    } else {
      console.log("Error fetching data:", data.message);
    }
  }
  function close() {
    modal.current.classList.add("fadeOut"); // Add fade-out animation class
    setTimeout(() => {
      modal.current.style.display = "none"; // Hide the modal after animation
      modal.current.classList.remove("fadeOut"); // Remove animation class
    }, 500); // Match the duration of the animation
  }

  return (
    <>
      <div id="logout" className="modal" ref={modal}>
        <div className="modal-content alert1">
          <h2 id="logout-heading">Log out of your account?</h2>
          <div className="btns">
            <input
              onClick={close}
              id="cancelBtn"
              className="submit-form post-submit"
              type="submit"
              value="Cancel"
            ></input>
            <input
              onClick={handleLogout}
              id="logoutBtn"
              className="submit-form post-submit"
              type="submit"
              value="Log out"
            ></input>
          </div>
        </div>
      </div>

      <nav className="nav-bar">
        <h5 id="logo-home">Memoir</h5>
        <div className="nav-items options">
          {props.page === "home" ? <CreatePostBtn /> : <HomeBtn />}

          <i class="fa-solid fa-right-from-bracket" onClick={logoutBox}></i>

          {/* <div className="menu-container">
            <div>
              <i
                className="fa-solid fa-bars hamburger-button"
                onClick={toggleMenu}
              ></i>
            </div>
            <div className="menu-dropdown" id="menu">
              {/* <button id="home-logout">
                 Account
              </button> *
              <button id="home-logout" onClick={logoutBox}>
                 Log out
              </button>
            </div>
          </div> */}

        </div>
      </nav>
    </>
  );
}
