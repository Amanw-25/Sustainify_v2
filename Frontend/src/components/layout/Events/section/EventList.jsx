import React, { useState } from "react";
import { Box, Grid, Typography, TextField, MenuItem } from "@mui/material";
import EventCard from "./EventCard";
import eventsData from "./eventData.js"; // Dummy events data

const EventList = ({ onRequestJoin }) => {
  const [selectedCity, setSelectedCity] = useState("");

  // Filtering events based on city
  const filteredEvents = selectedCity
    ? eventsData.filter((event) => event.location.includes(selectedCity))
    : eventsData;

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", padding: "24px" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        🌱 Upcoming Sustainability Events
      </Typography>

      {/* City Filter */}
      <TextField
        select
        label="Filter by City"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      >
        <MenuItem value="">All Cities</MenuItem>
        <MenuItem value="New York">New York</MenuItem>
        <MenuItem value="San Francisco">San Francisco</MenuItem>
        <MenuItem value="London">London</MenuItem>
      </TextField>

      {/* Events Grid */}
      <Grid container spacing={3}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <EventCard event={event} onRequestJoin={onRequestJoin} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventList;
