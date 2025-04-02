import React from "react";

export default function Logout() {
  return (
    <>
      <div id="logout" className="modal">
        <div className="modal-content alert1">
          <h3>Are you sure you want to log out?</h3>
          <div className="btns">
            <input
              id="cancelBtn"
              style={{backgroundColor: rgba(79, 100, 131, 0.2)}}
              className="submit-form post-submit"
              type="submit"
              value="Cancel"
            ></input>
            <input
              id="logoutBtn"
              style={{backgroundColor: rgba(200, 0, 0, 0.9)}}
              onclick=""
              className="submit-form post-submit"
              type="submit"
              value="Log out"
            ></input>
          </div>
        </div>
      </div>
    </>
  );
}
