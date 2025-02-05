import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import { FaCalendarAlt, FaMapMarkerAlt, FaUserAlt } from "react-icons/fa";

const EventCard = ({ event, onRequestJoin }) => {
  return (
    <Card sx={{ maxWidth: 400, borderRadius: "12px", boxShadow: 3 }}>
      {/* Event Image */}
      <CardMedia component="img" height="200" image={event.image} alt={event.title} />

      <CardContent>
        {/* Event Title */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {event.title}
        </Typography>

        {/* Event Details */}
        <Box display="flex" alignItems="center" mb={1}>
          <FaCalendarAlt style={{ marginRight: 8, color: "#00796B" }} />
          <Typography variant="body2">{event.date}</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <FaMapMarkerAlt style={{ marginRight: 8, color: "#D32F2F" }} />
          <Typography variant="body2">{event.location}</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2}>
          <FaUserAlt style={{ marginRight: 8, color: "#1976D2" }} />
          <Typography variant="body2">Organizer: {event.organizer}</Typography>
        </Box>

        {/* Request to Join Button */}
        <Button variant="contained" color="primary" fullWidth onClick={() => onRequestJoin(event)}>
          Request to Join
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
