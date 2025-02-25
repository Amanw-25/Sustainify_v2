import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

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

const TakeawaysSection = ({ takeaways }) => {

  const takeawaysItem = parseArrayData(takeaways);
  if (!takeawaysItem  || takeawaysItem.length === 0) return null;
  
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
        <StarIcon sx={{ mr: 1.5 }} /> Key Takeaways
      </Typography>

      <Grid container spacing={2.5}>
        {takeawaysItem .map((takeaway, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
                bgcolor: "#fff9f9",
                borderLeft: "4px solid #ea4335",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  bgcolor: "#fff5f5",
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: "rgba(234,67,53,0.1)",
                  borderRadius: "50%",
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StarIcon sx={{ color: "#ea4335" }} />
              </Box>
              <Typography sx={{ color: "#3c4043", flex: 1 }}>
                {takeaway}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TakeawaysSection;