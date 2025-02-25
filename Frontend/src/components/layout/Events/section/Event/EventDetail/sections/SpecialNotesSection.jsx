import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const SpecialNotesSection = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <Box>
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
        <InfoIcon sx={{ mr: 1.5 }} /> Special Notes
      </Typography>

      <Paper
        sx={{
          p: 3,
          bgcolor: "#fffde7",
          borderRadius: 3,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          mb: 5,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #ffa000",
        }}
      >
        <InfoIcon sx={{ color: "#ffa000" }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Special Notes
          </Typography>
          <Typography>{notes}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SpecialNotesSection;