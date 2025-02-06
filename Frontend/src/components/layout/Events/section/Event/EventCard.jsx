import React from "react";
import { Card, CardContent, Typography, CardMedia, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Event Image */}
      <CardMedia
        component="img"
        height="180"
        image={event.image || "https://via.placeholder.com/600x180"}
        alt={event.name}
        sx={{
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          objectFit: "cover",
        }}
      />
      
      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="div" color="primary" sx={{ fontWeight: "bold", mb: 2 }}>
          {event.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          🎤 Host: {event.host}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          📍 {event.location}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          🗓 {new Date(event.date).toLocaleDateString()} - 🕒 {event.time}
        </Typography>
        
        {/* Truncated Description */}
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {event.description}
        </Typography>
      </CardContent>

      {/* Button to View Details */}
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/event-details/${event._id}`)}
          sx={{
            borderRadius: "20px",
            fontWeight: "bold",
            padding: "10px 20px",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default EventCard;
