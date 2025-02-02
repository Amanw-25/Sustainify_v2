import React from "react";
import { Typography, Chip, Button, Paper, Box } from "@mui/material";
import { FaUserAlt, FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const BlogCard = ({ blog, index }) => {
  // Log blog data to verify the structure

  // Check if the author data exists
  const authorName = blog?.author?.name || "Unknown Author"; // Default value if author or name is missing

  return (
    <Paper
      elevation={3}
      style={{
        padding: "16px",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* Blog Image */}
      <img
        src={blog.previewImage} // Use the correct property 'previewImage'
        alt={blog.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "16px",
        }}
      />

      {/* Blog Content */}
      <Typography
        variant="h5"
        style={{
          fontWeight: "bold",
          color: "#374151",
          marginBottom: "8px",
        }}
      >
        {blog.title}
      </Typography>
      <Typography
        variant="h6"
        style={{ color: "#6b7280", marginBottom: "16px" }}
      >
        {blog.kicker} {/* Display kicker as the subtitle */}
      </Typography>

      {/* Author, Date, Read Time */}
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ marginBottom: "16px" }}
      >
        <Typography
          variant="body2"
          style={{
            display: "flex",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
          <FaUserAlt style={{ marginRight: "8px" }} />
          {authorName} {/* Display the author's name or "Unknown Author" */}
        </Typography>
        <Typography
          variant="body2"
          style={{
            display: "flex",
            alignItems: "center",
            color: "#6b7280",
          }}
        >
          <FaRegClock style={{ marginRight: "8px" }} />
          {blog.readTime} min read
        </Typography>
      </Box>

      {/* Tags */}
      <Box style={{ marginBottom: "16px" }}>
        {blog.tags && blog.tags.map((tag, idx) => (
          <Chip
            key={idx}
            label={tag}
            style={{
              marginRight: "8px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              fontSize: "12px",
            }}
          />
        ))}
      </Box>

      {/* Read More Button */}
      <Link to={`/blog/${blog._id}`} style={{ textDecoration: "none" }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          style={{
            borderRadius: "50px",
            padding: "10px 20px",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Read More
        </Button>
      </Link>
    </Paper>
  );
};

export default BlogCard;