import React from "react";
import { useNavigate } from "react-router-dom";

export default function homeBtn() {
  const navigate = useNavigate();
  function goToHome(e) {
    e.preventDefault();
    navigate('/home');
  }
  return (
    <>
      <a onClick={goToHome} className="user go-back" href="#">
        Home
      </a>
    </>
  );
}
