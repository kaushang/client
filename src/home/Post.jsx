import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Post(props) {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(props.initialLikes);
  const [liked, setLiked] = useState(props.isLiked);
  const [isLiking, setIsLiking] = useState(false);

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

  const likePost = async (event) => {
    event.preventDefault();
    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await fetch(`/api/like/${props.postData._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: props.user._id }),
      });

      if (!response.ok) {
        throw new Error("Like/unlike failed");
      }
      const data = await response.json();

      setLikes(data.likes);
      setLiked(data.message === "liked");
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const comment = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/comment/${props.postData._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        const user = props.user; // current active user
        const postData = props.postData; // individuals posts data
        const initialLikes = props.initialLikes; // individuals posts likes length
        const initialComments = props.initialComments; // individuals posts comments length
        let isLiked = true; // is Liked by the curent active user or not
        postData.likes.includes(user._id)
          ? (isLiked = true)
          : (isLiked = false);
        navigate("/comment", {
          state: {
            user,
            postData,
            initialComments,
            initialLikes,
            isLiked,
          },
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  async function deletePost(postId) {
    try {
      const response = await fetch(`/api/delete/${postId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      
      if (response.ok) {
        console.log("post deleted");
        // Call a callback function from props to notify parent
        if (props.onPostDelete) {
          props.onPostDelete(postId);
        }
        return true;
      } else {
        console.error("Error deleting post:", result.error);
        return false;
      }
    } catch (error) {
      console.error("Error in delete request:", error);
      return false;
    }
  }

  return (
    <>
      <div className="post">

        {props.postData.user.username === props.user.username && (props.page !== "comment" || props.page === "create") ? (
          <div className="menu-container postComment">
            <h5 className="content user-name" id="comment-text">
              @{props.postData.user.username}
            </h5>
            <i
              onClick={(e) => toggleMenu(e)}
              className="fa-solid fa-ellipsis-vertical menu-button"
            ></i>
            <div className="menu-dropdown" id="menuComment">
              <button
                id="deleteComment"
                onClick={() => {
                  deletePost(props.postData._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <h5 className="content user-name" id="comment-text">
            @{props.postData.user.username}
          </h5>
        )}



        {/* <h5 className="content user-name">
          @{props.postData.user.username || props.user.username}
        </h5> */}

        <p className="content">{props.postData.content || props.content}</p>

        <div className="likeNtime" style={{ padding: "0px 10px 0px 0px" }}>
          <button onClick={likePost} className="likeNheart">
            {liked ? (
              <>
                <i className="fa-solid fa-heart red"></i>
                <p className="like-count">{likes}</p>
              </>
            ) : (
              <>
                <i
                  style={{ color: "#253a82" }}
                  className="fa-solid fa-heart"
                ></i>
                <p className="like-count">{likes}</p>
              </>
            )}
          </button>

          <button onClick={comment} className="likeNheart">
            <i
              style={{ color: "#253a82", backgroundColor: "inherit" }}
              className="fa-solid fa-comment"
            ></i>
            <p id="" className="like-count">
              {props.initialComments}
            </p>
          </button>

          <p className="dateNtime">
            {formatDate(props.postData.date)}
            <br />
          </p>
        </div>
      </div>
    </>
  );
}
