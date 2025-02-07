import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";
import { ResponsiveBar } from "@nivo/bar";

const EventData = () => {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEventData();
  }, []);

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

  const totalEvents = events.length;
  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date()).length;
  const pastEvents = totalEvents - upcomingEvents;
  const onlineEvents = events.filter((event) => event.type === "online").length;
  const offlineEvents = events.filter((event) => event.type === "offline").length;

  const chartData = [
    { category: "Total Events", count: totalEvents, color: "#3b82f6" },
    { category: "Upcoming Events", count: upcomingEvents, color: "#10b981" },
    { category: "Past Events", count: pastEvents, color: "#f43f5e" },
    { category: "Online Events", count: onlineEvents, color: "#6366f1" },
    { category: "Offline Events", count: offlineEvents, color: "#f59e0b" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Event Data Overview
        </Typography>

        {/* Event Statistics Cards (One Row) */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 3,
            overflowX: "auto",
            whiteSpace: "nowrap",
            flexWrap: "nowrap",
          }}
        >
          {[
            { title: "Total Events", count: totalEvents, color: "#3b82f6" },
            { title: "Upcoming Events", count: upcomingEvents, color: "#10b981" },
            { title: "Past Events", count: pastEvents, color: "#f43f5e" },
            { title: "Online Events", count: onlineEvents, color: "#6366f1" },
            { title: "Offline Events", count: offlineEvents, color: "#f59e0b" },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: stat.color,
                color: "#fff",
                minWidth: "180px",
                height: "100px",
                flexShrink: 0,
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.count}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Event Distribution Chart */}
        <Box
          sx={{
            mt: 5,
            p: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            height: "70%",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Event Distribution Chart
          </Typography>
          <ResponsiveBar
            data={chartData}
            keys={["count"]}
            indexBy="category"
            margin={{ top: 50, right: 50, bottom: 80, left: 60 }}
            padding={0.3}
            colors={({ data }) => data.color}
            borderRadius={5}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Event Categories",
              legendPosition: "middle",
              legendOffset: 45,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Number of Events",
              legendPosition: "middle",
              legendOffset: -50,
            }}
            theme={{
              axis: {
                legend: {
                  text: {
                    fontSize: 14,
                    fontWeight: "bold",
                  },
                },
                ticks: {
                  text: {
                    fontSize: 12,
                    fontWeight: "bold",
                  },
                },
              },
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#ffffff"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EventData;
