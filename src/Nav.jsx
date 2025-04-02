import React from "react";
import { useNavigate } from "react-router-dom";
import CreatePostBtn from "./createPostBtn";
import HomeBtn from "./homeBtn";
import { useAuth } from "./AuthContext";
export default function Nav(props) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  function toggleMenu(event) {
    event.stopPropagation();
    closeAllMenus();
    let menuContainer = event.target.closest(".menu-container");
    let dropdown = menuContainer.querySelector(".menu-dropdown");
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
    const modal = document.querySelector(".modal");
    modal.style.display = "block";
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
  async function handleLogout() {
    const response = await fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    document.getElementById("logout").style.display = "none";
  }

  // const handleLogout = () => {
  //   logout();
  //   // The RequireAuth component will automatically redirect to landing
  // };
  return (
    <>
      <div id="logout" className="modal">
        <div className="modal-content alert1">
          <h2>Are you sure you want to log out?</h2>
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
        <h5 id="logo-home">memoir</h5>
        <div className="nav-items options">
          {props.page === "home" ? <CreatePostBtn /> : <HomeBtn />}

          <div className="menu-container">
            <div>
              <i
                className="fa-solid fa-bars hamburger-button"
                onClick={toggleMenu}
              ></i>
            </div>
            <div className="menu-dropdown" id="menu">
              {/* <a href="/account">Account</a> */}
              {/* <button id="home-logout" onClick={handleLogout}>Logout</button> */}
              <a id="home-logout" onClick={logoutBox} href="#">
                Log out
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
