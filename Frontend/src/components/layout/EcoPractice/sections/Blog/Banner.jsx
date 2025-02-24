import React from "react";
import { Typography, Box } from "@mui/material";

const Banner = () => {
  return (
    <Box
      style={{
        backgroundImage:
          "url('https://cdn.pixabay.com/photo/2015/06/01/09/04/blog-793047_1280.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h1"
        style={{
          color: "#ffffff",
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        }}
      >
        Blog Articles on Sustainability
      </Typography>
    </Box>
  );
};

export default Banner;