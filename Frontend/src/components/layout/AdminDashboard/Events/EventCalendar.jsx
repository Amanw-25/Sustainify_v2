import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../Global/Sidebar";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { BASE_URL } from "../../../../config.js";

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Check if the screen is mobile-sized
  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/event/getAllEvents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const formattedEvents = data.events.map((event) => ({
        id: event._id,
        title: event.name,
        start: event.date,
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        textColor: "#ffffff",
        className: "event-item",
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventClick = (info) => {
    navigate(`/event/${info.event.id}`);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f6f9" }}>
      {/* Mobile Sidebar Toggle Button */}
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
      {!isMobile && (
        <Box sx={{ width: "250px" }}>
          <Sidebar />
        </Box>
      )}

      {/* Sidebar for Small Screens */}
      <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar />
      </Drawer>

      <Box
        sx={{
          flex: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          width: "100%",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          sx={{
            fontWeight: "bold",
            color: "#1e293b",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Event Calendar
        </Typography>

        <Paper
          sx={{
            p: 3,
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            borderRadius: 2,
            flex: 1,
            overflow: "hidden",
            "& .fc": {
              fontFamily: "'Inter', sans-serif",
              "--fc-border-color": "#e2e8f0",
              "--fc-button-bg-color": "#3b82f6",
              "--fc-button-border-color": "#3b82f6",
              "--fc-button-hover-bg-color": "#2563eb",
              "--fc-button-hover-border-color": "#2563eb",
              "--fc-button-active-bg-color": "#1d4ed8",
              "--fc-today-bg-color": "#eff6ff",
              "--fc-event-bg-color": "#3b82f6",
              "--fc-event-border-color": "#2563eb",
            },
            "& .fc-header-toolbar": {
              mb: 3,
              flexWrap: isMobile ? "wrap" : "nowrap",
            },
            "& .fc-toolbar-title": {
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1e293b",
            },
            "& .fc-button": {
              textTransform: "capitalize",
              boxShadow: "none",
              padding: "6px 12px",
              fontWeight: "500",
            },
            "& .fc-day-today": {
              backgroundColor: "rgba(59, 130, 246, 0.1) !important",
            },
            "& .event-item": {
              borderRadius: "4px",
              padding: "2px 4px",
              fontWeight: "500",
              fontSize: "0.875rem",
            },
            "& .fc-daygrid-day-number": {
              color: "#475569",
              padding: "8px",
              fontSize: "0.875rem",
            },
            "& .fc-col-header-cell": {
              padding: "12px 0",
              backgroundColor: "#f8fafc",
              "& .fc-col-header-cell-cushion": {
                color: "#64748b",
                fontWeight: "600",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              },
            },
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView={isMobile ? "dayGridDay" : "dayGridMonth"}
            events={events}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: isMobile ? "dayGridDay,dayGridWeek" : "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            height={isMobile ? "70vh" : "80vh"}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default EventCalendar;
