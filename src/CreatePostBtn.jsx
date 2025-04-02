import React from "react";
import { useNavigate } from "react-router-dom";
export default function createPostBtn() {

  const navigate = useNavigate();

  async function handleCreatePost () {
      try {
        const response = await fetch(`/api/post`, {
          method:"GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();

        if (response.ok) {
          const posts = data.posts;
          const user = data.user;
          navigate("/create",  {
            state: { posts, user }
          });
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
  }
  return (
    <>
      <button onClick={handleCreatePost} className="user go-back" >
        <i className="fa-regular fa-pen-to-square"></i> Create post
      </button>
    </>
  );
}
