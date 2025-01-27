import React ,{useState}from "react";
import {
  Typography,

  TextField,
  Button,
  Avatar,
} from "@mui/material";


const CommentSection = () => {
  const [comment, setComment] = useState(""); // State for comment input
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Alice Smith",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      comment: "Great article! Very insightful.",
    },
    {
      id: 2,
      name: "Bob Johnson",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      comment: "Loved the examples provided.",
    },
    {
      id: 3,
      name: "Charlie Brown",
      img: "https://randomuser.me/api/portraits/men/45.jpg",
      comment: "This is exactly what I needed to read!",
    },
  ]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        name: "You",
        img: "https://randomuser.me/api/portraits/men/1.jpg",
        comment: comment.trim(),
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };
  
  return (
    <div style={{ padding: "24px", borderRadius: "8px" }}>
      <Typography
        variant="h4"
        style={{
          fontWeight: "bold",
          marginTop: "16px",
          marginBottom: "24px",
          color: "#374151",
        }}
      >
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
        Add Comment
      </Button>

      {/* Display Comments */}
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
              src={comment.img}
              alt={comment.name}
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
                {comment.name}
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