import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EventData = () => {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEventData();
  }, []);

  // Fetch Events from API
  const fetchEventData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/event/getAllEvents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Count Events
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date()).length;
  const pastEvents = totalEvents - upcomingEvents;

  // Chart Data
  const chartData = {
    labels: ["Total Events", "Upcoming Events", "Past Events"],
    datasets: [
      {
        label: "Events",
        data: [totalEvents, upcomingEvents, pastEvents],
        backgroundColor: ["#3b82f6", "#10b981", "#f43f5e"],
        borderRadius: 5,
      },
    ],
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Event Data Overview
        </Typography>

        {/* Event Statistics Cards */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#3b82f6", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Total Events</Typography>
                <Typography variant="h4" fontWeight="bold">{totalEvents}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#10b981", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Upcoming Events</Typography>
                <Typography variant="h4" fontWeight="bold">{upcomingEvents}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: "#f43f5e", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Past Events</Typography>
                <Typography variant="h4" fontWeight="bold">{pastEvents}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Event Distribution Chart */}
        <Box sx={{ mt: 5, p: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Event Distribution Chart
          </Typography>
          <Bar data={chartData} />
        </Box>
      </Box>
    </Box>
  );
};

export default EventData;
