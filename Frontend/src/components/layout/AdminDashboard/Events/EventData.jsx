import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";
import { ResponsiveBar } from "@nivo/bar";

const EventData = () => {
  const [events, setEvents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const isMobile = useMediaQuery("(max-width: 1024px)");

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
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
      {/* Sidebar Toggle Button for Mobile */}
      {isMobile && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            backgroundColor: "white",
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar for Large Screens */}
      {!isMobile && <Sidebar />}

      {/* Sidebar for Small Screens */}
      <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar />
      </Drawer>

      <Box sx={{ flex: 1, p: isMobile ? 2 : 3, width: "100%" }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          color="primary"
          sx={{ textAlign: isMobile ? "center" : "left", mb: 3 }}
        >
          Event Data Overview
        </Typography>

        {/* Event Statistics Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mt: 2,
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
                minWidth: isMobile ? "150px" : "180px",
                height: "100px",
                flexShrink: 0,
                borderRadius: "12px",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body1">{stat.title}</Typography>
                <Typography variant="h5" fontWeight="bold">
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
            height: isMobile ? "50vh" : "70vh",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: "center" }}>
            Event Distribution Chart
          </Typography>
          <ResponsiveBar
            data={chartData}
            keys={["count"]}
            indexBy="category"
            margin={{ top: 40, right: 20, bottom: isMobile ? 60 : 80, left: 40 }}
            padding={0.3}
            colors={({ data }) => data.color}
            borderRadius={5}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: isMobile ? 45 : 0,
              legend: "Event Categories",
              legendPosition: "middle",
              legendOffset: 40,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Number of Events",
              legendPosition: "middle",
              legendOffset: -40,
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
                    fontSize: isMobile ? 10 : 12,
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
