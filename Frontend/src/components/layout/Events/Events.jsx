import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Box, Typography, Container, useTheme } from "@mui/material";
import EventCard from "./section/Event/EventCard";
import { BASE_URL } from "../../../config.js";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/event/getAllEvents`);
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events); 
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Get today's date
  const today = new Date();

  // Separate events into past and upcoming
  const upcomingEvents = events.filter(event => new Date(event.date) >= today);
  const pastEvents = events.filter(event => new Date(event.date) < today);

  return (
    <Container maxWidth="lg" sx={{ mt: 0.2 }}>
      {/* Upcoming Events */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mt: 6 }}>
        All Upcoming Events
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {upcomingEvents.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mt: 6 }}>
            Past Events
          </Typography>

          
        </>
      )}
    </Container>
  );
};

export default Events;
