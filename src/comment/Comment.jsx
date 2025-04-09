import React from "react";
import Nav from "../Nav";
import Post from "../home/Post";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Comment(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const commentBtn = useRef(null);
  const {
    user,
    postData: initialPostData,
    initialComments,
    initialLikes,
    isLiked,
  } = location.state || {};

  const [comment, setComment] = useState("");
  const [postData, setPostData] = useState(initialPostData);
  const [comments, setComments] = useState(initialComments);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    async function fetchPostData() {
      if (!initialPostData?._id) return;

      try {
        const response = await fetch(`https://server-71hv.onrender.com/api/post/${initialPostData._id}`, {
        // const response = await fetch(`/api/post/${initialPostData._id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const updatedPost = await response.json();

        if (response.ok) {
          setPostData(updatedPost.post);
          setComments(updatedPost.post.comments.length);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    }

    fetchPostData();
  }, []);

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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

  async function handleComment(event) {
    event.preventDefault();
    setLoading(true); // Show loading animation
    commentBtn.current.setAttribute("disabled", true); // Disable the button
    if (comment === "") return;
    const content = comment;
    try {
      const response = await fetch(`https://server-71hv.onrender.com/api/comment/${postData._id}`, {
      // const response = await fetch(`/api/comment/${postData._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setPostData((prevPostData) => ({
          ...prevPostData,
          comments: result.comment.comments,
        }));
        setComments(result.comment.comments.length);
        setComment("");
      } else {
        if(response.status === 401) {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error commenting post:", error);
    } finally {
      setLoading(false); // Stop loading animation
      commentBtn.current.removeAttribute("disabled"); // Re-enable button
    }
  }

  async function deleteComment(commentId) {
    const response = await fetch(`https://server-71hv.onrender.com/api/delete/comment/${postData._id}`, {
    // const response = await fetch(`/api/delete/comment/${postData._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
      credentials: "include",
    });
    const result = await response.json();
    if (response.ok) {
      setPostData(result.post);
      setComments(result.post.comments.length);
    } else {
      console.error("Error deleting comment:", error.message);
    }
  }

  return (
    <>
      <Nav />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="main-cont">
          <Post
            page="comment"
            user={user}
            postData={postData}
            initialComments={comments}
            initialLikes={initialLikes}
            isLiked={isLiked}
          />

          <div className="post">
            <form
              id="commentForm"
              data-post-id="<%=post._id%>"
              data-user-id="<%=user._id%>"
            >
              <textarea
                required
                rows="4"
                id="comment"
                className="post-content"
                placeholder="Post your comment"
                name="content"
                value={comment}
                onChange={handleChange}
              ></textarea>
              <button
                ref={commentBtn}
                className={`submit-form post-submit reply ${
                  comment === "" ? "disable" : ""
                }`}
                onClick={handleComment}
                type="button"
                disabled={comment === ""}
              >
                {loading ? (
                  <div className="spinner-invert inside-btn"></div>
                ) : (
                  "Comment"
                )}
              </button>
            </form>
          </div>

          {postData?.comments.length === 0 ? (
            <p className="sub-heading" style={{ fontWeight: "400" }}>
              No comments yet.
            </p>
          ) : (
            <p className="sub-heading">Comments</p>
          )}
          {[...(postData?.comments || [])].reverse().map((element) => {
            return (
              <div className="postDatas" key={element._id}>
                <div className="post">
                  {element.commentUsername === user.username ? (
                    <div className="menu-container postComment">
                      <h5 className="content user-name" id="comment-text">
                        @{element.commentUsername}
                      </h5>
                      <i
                        onClick={(e) => toggleMenu(e)}
                        className="fa-solid fa-ellipsis-vertical menu-button"
                      ></i>
                      <div className="menu-dropdown" id="menuComment">
                        <button
                          id="deleteComment"
                          onClick={() => {
                            deleteComment(element._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h5 className="content user-name" id="comment-text">
                      @{element.commentUsername}
                    </h5>
                  )}

                  <p className="content">{element.commentContent}</p>

                  <div
                    className="likeNtime"
                    style={{ padding: "0px 10px 0px 0px" }}
                  >
                    <p className="dateNtime ">
                      {formatDate(element.commentDate)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
