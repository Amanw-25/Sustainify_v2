import React from "react";
import { Box, Container, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import Paper from "@mui/material/Paper";

const EventHeader = ({ 
  event, 
  daysRemaining, 
  isPastEvent, 
  handleGoBack, 
  handleShare 
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        marginTop: -4,
        height: { xs: 300, sm: 320, md: 340 },
        width: "100%",
        overflow: "hidden",
        mb: { xs: 12, sm: 11, md: 12 },
      }}
    >
      {/* Background Image with Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${
            event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", height: "100%" }}>
        {/* Back Button */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 40, md: 20 },
            left: { xs: 16, md: -50 },
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={handleGoBack}
            sx={{
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Content Container */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: -80, sm: -70, md: 50 },
            width: "100%",
            display: "flex",
            justifyContent: { xs: "center", md: "space-between" },
            alignItems: { xs: "center", md: "flex-end" },
            flexDirection: { xs: "column", md: "row" },
            zIndex: 0,
            px: { xs: 2, md: 0 },
            gap: { xs: 3, md: 0 },
          }}
        >
          {/* Event Details Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "column", md: "row" },
              alignItems: { xs: "center", sm: "center", md: "flex-end" },
              gap: { xs: 3, sm: 3, md: 4 },
              width: "100%",
              maxWidth: { xs: "100%", md: "75%" },
            }}
          >
            {/* Days Countdown Box */}
            <Paper
              elevation={6}
              sx={{
                transform: {
                  xs: "translateY(-10%) translateX(-10%)",
                  sm: "translateY(-50%)",
                  md: "translateY(-40%)",
                },
                width: { xs: 100, sm: 120, md: 150 },
                height: { xs: 100, sm: 120, md: 150 },
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: isPastEvent ? "#f5f5f5" : "white",
                border: isPastEvent ? "2px solid #e0e0e0" : "none",
                flexShrink: 0,
                zIndex: 3,
              }}
            >
              <Typography
                variant="h2"
                color={isPastEvent ? "text.disabled" : "error"}
                sx={{
                  fontWeight: 700,
                  lineHeight: 1,
                  fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                {isPastEvent ? "PAST" : Math.abs(daysRemaining)}
              </Typography>
              <Typography
                variant="body2"
                color={isPastEvent ? "text.disabled" : "text.primary"}
              >
                {isPastEvent
                  ? "EVENT"
                  : daysRemaining === 1
                    ? "DAY LEFT"
                    : "DAYS LEFT"}
              </Typography>
            </Paper>

            {/* Event Title & Details */}
            <Box
              sx={{
                textAlign: { xs: "center", sm: "center", md: "left" },
                transform: {
                  xs: "translateY(-20px)",
                  sm: "translateY(-25px)",
                  md: "translateY(-40px)",
                },
                width: "100%",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
                  mb: { xs: 2, sm: 2, md: 1.5 },
                  px: { xs: 1, sm: 2, md: 0 },
                  wordBreak: "break-word",
                  lineHeight: { xs: 1.3, md: 1.2 },
                  marginTop: { md: -18 },
                }}
              >
                {event.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  justifyContent: {
                    xs: "center",
                    sm: "center",
                    md: "flex-start",
                  },
                  flexWrap: "wrap",
                  px: { xs: 1, sm: 0 },
                }}
              >
                <Chip
                  label={event.type}
                  color="primary"
                  sx={{
                    borderRadius: 6,
                    fontWeight: 600,
                    "& .MuiChip-label": { px: 2 },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    height: 32,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: { xs: 2, md: 0 },
              mb: { xs: 2, md: 0 },
              position: { xs: "relative", md: "static" },
              zIndex: 5,
            }}
          >
            <Tooltip title="Share event">
              <IconButton
                onClick={handleShare}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EventHeader;