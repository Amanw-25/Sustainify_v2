import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  CircularProgress,
  Rating,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BASE_URL } from "../../../../../config";
import { toast } from "react-toastify";

const CommentSection = ({ blogId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${BASE_URL}/blog/getBlogReviews/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setComments(data.reviews);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (blogId) fetchComments();
  }, [blogId]);

  // Handle comment submission
  const handleAddComment = async () => {
    if (!comment.trim() || rating === 0) {
      toast.error("Please add a comment and select a rating!");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/blog/createBlogReview/${blogId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment, rating }),
        }
      );

      const newComment = await response.json();

      if (response.ok) {
        toast.success("Comment added successfully!");
        setComments([...comments, newComment.review]);
        setComment("");
        setRating(0);
      } else {
        toast.error(newComment.message || "Error posting comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, backgroundColor: "#f9fafb" }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
        Comments & Reviews
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          size={isMobile ? "small" : "medium"}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          variant="outlined"
          sx={{ bgcolor: "white", borderRadius: 1 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          disabled={isLoading}
          sx={{
            textTransform: "none",
            borderRadius: 1,
            fontWeight: "bold",
            width:"20%",
            py: 1.5,
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Post Comment"}
        </Button>
      </Box>

      {comments.length > 0 ? (
        comments.map((comment) => (
          <Box
            key={comment._id}
            display="flex"
            gap={2}
            p={2}
            mb={2}
            bgcolor="white"
            borderRadius={2}
            boxShadow={1}
          >
            <Avatar
              src={comment.userId.profilePhoto || "/default-avatar.jpg"}
              alt={comment.userId.name}
              sx={{ width: 48, height: 48, border: "2px solid #3b82f6" }}
            />
            <Box>
              <Typography fontWeight="bold">{comment.userId.name}</Typography>
              <Rating value={comment.rating} readOnly size="small" />
              <Typography color="text.secondary">{comment.comment}</Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography textAlign="center" color="text.secondary" py={2}>
          No comments yet. Be the first to add one!
        </Typography>
      )}
    </Box>
  );
};

export default CommentSection;
