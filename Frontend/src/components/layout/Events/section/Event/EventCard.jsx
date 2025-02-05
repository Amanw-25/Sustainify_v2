import React from "react";
import { Card, CardContent, Typography, CardMedia, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={event.image}
        alt={event.name}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          📍 {event.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          🗓 {new Date(event.date).toLocaleDateString()} - 🕒 {event.time}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {event.description}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={() => navigate(`/event-details/${event._id}`)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
