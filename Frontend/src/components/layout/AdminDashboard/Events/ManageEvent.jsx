import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../Global/Sidebar";
import EventModal from "./AddEventModal";
import { BASE_URL } from "../../../../config.js";

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const isMobile = useMediaQuery("(max-width: 1024px)");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/event/getAllEvents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch events");
      setEvents(data.events);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const response = await fetch(`${BASE_URL}/event/addEvent`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: newEvent,
      });
      if (response.ok) handleSuccess();
      else {
        const data = await response.json();
        throw new Error(data.message || "Failed to add event");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      const response = await fetch(
        `${BASE_URL}/event/updateEvent/${selectedEvent._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: updatedEvent,
        }
      );
      if (response.ok) handleSuccess();
      else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update event");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const response = await fetch(`${BASE_URL}/event/deleteEvent/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete event");
      }
      fetchEvents();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleSuccess = () => {
    fetchEvents();
    setOpenModal(false);
    setSelectedEvent(null);
    setError(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((event) =>
    tab === 0
      ? new Date(event.date) >= new Date()
      : new Date(event.date) < new Date()
  );

  useEffect(() => {
    if (token) fetchEvents();
  }, [token]);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
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

      {!isMobile && (
        <Box sx={{ width: "250px" }}>
          <Sidebar />
        </Box>
      )}

      <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar />
      </Drawer>

      <Box sx={{ flex: 1, p: 3, width: "100%" }}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight="bold"
          color="primary"
          sx={{ mb: 3, textAlign: isMobile ? "center" : "left" }}
        >
          Manage Events
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ mb: 3 }}
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab label="Upcoming Events" />
          <Tab label="Past Events" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredEvents.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 5, color: "gray" }}>
            No {tab === 0 ? "upcoming" : "past"} events found.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "calc(100vh - 250px)",
              overflowY: "auto",
              borderRadius: 2,
              boxShadow: 3,
              overflowX: "auto",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Event Name", "Date", "Time", "Type", "Actions"].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#3B82F6",
                        zIndex: 2,
                        minWidth: isMobile ? "150px" : "auto",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event._id} hover>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.date.split('T')[0]}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: "flex", 
                        gap: 1,
                        flexDirection: isMobile ? "column" : "row"
                      }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(event)}
                          sx={{ minWidth: isMobile ? "100%" : "auto" }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(event._id)}
                          sx={{ minWidth: isMobile ? "100%" : "auto" }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="contained"
          color="success"
          sx={{ 
            position: "fixed", 
            bottom: isMobile ? 16 : 20, 
            right: isMobile ? 16 : 20,
            boxShadow: 3
          }}
          onClick={() => setOpenModal(true)}
        >
          + Add Event
        </Button>

        {openModal && (
          <EventModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={selectedEvent ? handleEditEvent : handleAddEvent}
            initialData={selectedEvent || {}}
            isEditing={!!selectedEvent}
          />
        )}
      </Box>
    </Box>
  );
};

export default ManageEvent;