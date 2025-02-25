import React from "react";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

const LoadingScreen = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to bottom right, #f5f7fa, #e4e8f0)",
      }}
    >
      <CircularProgress
        size={80}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
          mb: 3,
          boxShadow: "0 0 20px rgba(0,0,0,0.05)",
        }}
      />
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          textAlign: "center",
          maxWidth: "80%",
          animation: "pulse 2s infinite",
        }}
      >
        Loading Event Details...
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.9rem", textAlign: "center" }}
        >
          Preparing an amazing experience for you
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;