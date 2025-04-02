import React from "react";
import Nav from "../Nav";
import { useState, useEffect } from "react";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  // current user
  const [user, setUser] = useState(null);
  // all posts
  const [posts, setPosts] = useState([]);
  // loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/home", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setPosts(data.posts);
        } else {
          console.error("Error fetching data:", data.message);
          // Redirect to login if unauthorized
          if (response.status === 401) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handlePostDelete = (deletedPostId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== deletedPostId));
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Nav page={"home"} />
        <div className="main-cont">
          <p className="loading">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Nav page={"home"} />
      <div className="main-cont">
        {posts.length > 0 ? (
          posts
            .slice()
            .reverse()
            .map((element, index) => (
              <Post
                page="home"
                key={index}
                user={user}
                postData={element}
                initialComments={element.comments ? element.comments.length : 0}
                initialLikes={element.likes ? element.likes.length : 0}
                isLiked={user && element.likes ? element.likes.includes(user._id) : false}
                onPostDelete={handlePostDelete}
              />
            ))
        ) : (
          <p>No posts available. Create your first post!</p>
        )}
      </div>
    </div>
  );
}