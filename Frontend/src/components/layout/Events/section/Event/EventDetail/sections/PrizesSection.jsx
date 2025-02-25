import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const parseArrayData = (data) => {
  if (!data || data.length === 0) return [];
  
  try {
    if (typeof data[0] === 'string' && !data[0].startsWith('[')) {
      return data;
    }
    return JSON.parse(data[0]);
  } catch (error) {
    console.error("Error parsing data:", error);
    return [];
  }
};

const PrizesSection = ({ prizes }) => {
  const prizesItems = parseArrayData(prizes);

  if (!prizesItems || prizesItems.length === 0) return null;

  
  return (
    <Box sx={{ mb: 5 }}>
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
        <EmojiEventsIcon sx={{ mr: 1.5 }} /> Prizes & Rewards
      </Typography>

      <Grid container spacing={2}>
        {prizesItems.map((prize, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                background: "linear-gradient(to bottom right, #e8f0fe, #f5f9ff)",
                boxShadow: "0 4px 10px rgba(26,115,232,0.15)",
                border: "1px solid #bfdaff",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(26,115,232,0.2)",
                },
              }}
            >
              <EmojiEventsIcon
                sx={{
                  fontSize: 40,
                  color: ["#FFD700", "#C0C0C0", "#CD7F32"][index] || "#1a73e8",
                  mb: 1.5,
                }}
              />
              <Typography
                sx={{
                  color: "#3c4043",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                }}
              >
                {prize}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PrizesSection;