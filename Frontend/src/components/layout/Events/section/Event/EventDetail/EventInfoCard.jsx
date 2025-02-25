import React from "react";
import { Box, Card, CardContent, Typography, Grid, Paper, Avatar, AvatarGroup, Divider, Button, CircularProgress } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";

const EventInfoCard = ({ event, dummyParticipants, handleRequest, buttonLoading }) => {
  // Format the date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format the time
  const formatTime = (timeString) => {
    return timeString || "TBA";
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 20,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Date, Time, Location Info */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#1a73e8",
              mb: 3,
            }}
          >
            Event Details
          </Typography>

          {/* Date */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={2} sm={1}>
              <CalendarTodayIcon sx={{ color: "#5f6368" }} />
            </Grid>
            <Grid item xs={10} sm={11}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(event.date)}
              </Typography>
            </Grid>
          </Grid>

          {/* Time */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={2} sm={1}>
              <AccessTimeIcon sx={{ color: "#5f6368" }} />
            </Grid>
            <Grid item xs={10} sm={11}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatTime(event.time)}
              </Typography>
            </Grid>
          </Grid>

          {/* Location */}
          <Grid container spacing={2}>
            <Grid item xs={2} sm={1}>
              <LocationOnIcon sx={{ color: "#5f6368" }} />
            </Grid>
            <Grid item xs={10} sm={11}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {event.location}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Participants Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#1a73e8",
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <PeopleIcon sx={{ mr: 1 }} /> Participants
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 36, height: 36 } }}>
              {dummyParticipants.map((participant, index) => (
                <Avatar
                  key={index}
                  alt={participant.name}
                  src={participant.avatar}
                  sx={{ bgcolor: participant.color }}
                />
              ))}
            </AvatarGroup>
            <Typography variant="body2" color="text.secondary">
              {dummyParticipants.length} people joined
            </Typography>
          </Box>

          {/* <Paper
            sx={{
              p: 2,
              bgcolor: "#f1f3f4",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Limited seats available
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "#1a73e8" }}>
              {Math.floor(Math.random() * 10) + 5} spots left
            </Typography>
          </Paper> */}
        </Box>

        {/* Request to Join Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleRequest}
          disabled={buttonLoading}
          sx={{
            borderRadius: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(26,115,232,0.4)",
          }}
        >
          {buttonLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Request to Join"
          )}
        </Button>

        <Typography
          variant="caption"
          align="center"
          sx={{ display: "block", mt: 2, color: "text.secondary" }}
        >
          The organizer will review your request
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EventInfoCard;