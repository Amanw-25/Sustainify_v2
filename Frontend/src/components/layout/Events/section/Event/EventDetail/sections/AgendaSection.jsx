import React from "react";
import { Box, Typography, Paper, Fade } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";


// Helper function to parse string array representation
const parseArrayData = (data) => {
  if (!data || data.length === 0) return [];
  
  try {
    // Handle case when data is already an array of strings
    if (typeof data[0] === 'string' && !data[0].startsWith('[')) {
      return data;
    }
    
    // Parse the string representation of array
    return JSON.parse(data[0]);
  } catch (error) {
    console.error("Error parsing data:", error);
    return [];
  }
};

const AgendaSection = ({ agenda, theme }) => {
  const agendaItems = parseArrayData(agenda);
  
  if (!agendaItems.length) return null;
  
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
        <ListAltIcon sx={{ mr: 1.5 }} /> Event Agenda
      </Typography>

      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            left: "20px",
            top: "30px",
            bottom: "20px",
            width: "2px",
            bgcolor: "#e0e0e0",
            zIndex: 0,
          }}
        />

        {agendaItems.map((item, index) => (
          <Fade in={true} key={index} timeout={500 + index * 100}>
            <Box
              sx={{
                position: "relative",
                pl: 5,
                pb: 3,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "2px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  bgcolor: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {index + 1}
              </Box>

              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#f8f9fa",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  transition: "all 0.3s",
                  border: "1px solid rgba(0,0,0,0.04)",
                  "&:hover": {
                    transform: "translateX(8px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    bgcolor: "#f1f3f4",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#3c4043",
                    fontWeight: 500,
                  }}
                >
                  {item}
                </Typography>
              </Paper>
            </Box>
          </Fade>
        ))}
      </Box>
    </Box>
  );
};

export default AgendaSection;