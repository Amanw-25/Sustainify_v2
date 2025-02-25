import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const LocationSection = ({ location }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          fontWeight: 600,
          color: "#1a73e8",
        }}
      >
        <LocationOnIcon sx={{ mr: 1.5 }} /> Event Location
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 0,
          borderRadius: 4,
          overflow: "hidden",
          height: 350,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <iframe
          title="Event Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            location
          )}&output=embed`}
        />
      </Paper>
    </Box>
  );
};

export default LocationSection;