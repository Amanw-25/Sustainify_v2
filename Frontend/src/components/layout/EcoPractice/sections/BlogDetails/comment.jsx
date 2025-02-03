import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";

const CommentSection = ({ blogId }) => {
  const [comment, setComment] = useState(""); 
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:5130/api/v1/sustainify/blog/getBlogReviews/${blogId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (comment.trim() && !isLoading) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(
          `http://localhost:5130/api/v1/sustainify/blog/createBlogReview/${blogId}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: comment.trim() })
          }
        );

        const newComment = await response.json();
        setComments([...comments, newComment]);
        setComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div style={{ padding: "24px", borderRadius: "8px" }}>
      <Typography variant="h4" style={{
        fontWeight: "bold",
        marginTop: "16px",
        marginBottom: "24px",
        color: "#374151",
      }}>
        Comments
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Add a comment..."
        value={comment}
        onChange={handleCommentChange}
        variant="outlined"
        style={{
          marginBottom: "16px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddComment}
        disabled={isLoading}
        style={{
          marginBottom: "32px",
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "10px 16px",
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: "8px",
        }}
      >
        {isLoading ? "Posting..." : "Add Comment"}
      </Button>

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              marginBottom: "24px",
              padding: "16px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Avatar
              src={comment.userProfileImage || "https://randomuser.me/api/portraits/men/1.jpg"}
              alt={comment.userName}
              style={{
                width: "48px",
                height: "48px",
                border: "2px solid #3b82f6",
              }}
            />
            <div>
              <Typography
                variant="subtitle1"
                style={{
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: "4px",
                }}
              >
                {comment.userName}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  color: "#4b5563",
                  lineHeight: "1.6",
                }}
              >
                {comment.comment}
              </Typography>
            </div>
          </div>
        ))
      ) : (
        <Typography
          variant="body1"
          style={{
            color: "#6b7280",
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          No comments yet. Be the first to add one!
        </Typography>
      )}
    </div>
  );
};

export default CommentSection;