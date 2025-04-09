import React, { useEffect } from "react";
import Nav from "../Nav";
import Post from "../home/Post";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuth } from "../AuthContext";

export default function Create() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const postBtn = useRef(null);
  const [post, setPost] = useState("");
  const [postsArray, setPostsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false); // Add loading state

  // Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://server-71hv.onrender.com/api/post", {
        // const response = await fetch("/api/post", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setPostsArray(data.posts);
        } else if (response.status >= 400) {
          // Unauthorized - redirect to landing
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPostData();
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    setPost(event.target.value);
  };

  async function createPost(event) {
    event.preventDefault();
    setLoading(true); // Show loading animation
    postBtn.current.setAttribute("disabled", true); // Disable the button
    if (post === "" || !isAuthenticated) return;

    const content = post;
    try {
      const response = await fetch("https://server-71hv.onrender.com/api/post", {
      // const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setPostsArray([...data.posts]);
        setPost("");
      } else if (response.status === 401) {
        // Unauthorized - redirect to landing
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false); // Stop loading animation
      postBtn.current.removeAttribute("disabled"); // Re-enable button
    }
  }

  const handlePostDelete = (deletedPostId) => {
    // Filter out the deleted post from postsArray
    setPostsArray((postsArray) =>
      postsArray.filter((post) => post._id !== deletedPostId)
    );
  };

  // Show loading while checking authentication
  if (isAuthenticated === null || isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Nav />
        <div className="main-cont">
          <p className="loading">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Nav />

        <div className="main-cont">
          <div className="create-post">
            <form action="/post" method="POST">
              <h2 className="heading post-heading create-post-heading">
                Create a post
              </h2>
              <textarea
                required
                rows="4"
                className="post-content"
                placeholder="What's on your mind?"
                name="content"
                value={post}
                onChange={handleChange}
              ></textarea>

              <button
                ref={postBtn}
                className={`submit-form post-submit reply ${post === "" ? "disable" : ""}`}
                onClick={createPost}
                id="submit"
                type="button"
                disabled={post === ""}
              >
                {loading ? (
                  <div className="spinner-invert inside-btn"></div>
                ) : (
                  "Create Post"
                )}
              </button>
            </form>
          </div>
          <div className="posts">
            {postsArray.length === 0 ? (
              <p className="sub-heading">No posts yet</p>
            ) : (
              <p className="sub-heading">Your posts</p>
            )}

            {postsArray
              .slice()
              .reverse()
              .map((element, index) => {
                const currentUser = user || {};
                const isLiked =
                  element.likes && currentUser._id
                    ? element.likes.includes(currentUser._id)
                    : false;

                return (
                  <Post
                    page="create"
                    key={index}
                    user={currentUser}
                    postData={element}
                    initialComments={element.comments?.length || 0}
                    initialLikes={(element.likes || []).length}
                    isLiked={isLiked}
                    onPostDelete={handlePostDelete}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
