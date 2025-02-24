import React from "react";
import { Button, Box } from "@mui/material";
import { FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";

const PostArticleButton = () => {
  return (
    <Box display="flex" justifyContent="flex-end" style={{ marginBottom: "32px" }}>
      <Link to="/post-article" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            borderRadius: "50px",
            fontWeight: "bold",
            padding: "10px 20px",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaPen style={{ marginRight: "8px" }} />
          Post Article
        </Button>
      </Link>
    </Box>
  );
};

export default PostArticleButton;