import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Tabs, Tab, Paper 
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "../Global/Sidebar";
import EventModal from "./AddEventModal";
import { BASE_URL } from "../../../../config.js";

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem("token"); // Authentication Token

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch All Events
  const fetchEvents = async () => {
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

  // Handle Add Event
  const handleAddEvent = async (newEvent) => {
    try {
      const response = await fetch(`${BASE_URL}/event/addEvent`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: newEvent, // FormData (Includes Image)
      });

      if (response.ok) {
        fetchEvents();
        setOpenModal(false);
      } else {
        console.error("Failed to add event");
        console.log(response);
      }
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  // Handle Edit Event
  const handleEditEvent = async (updatedEvent) => {
    try {
      const response = await fetch(`${BASE_URL}/event/updateEvent/${selectedEvent._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: updatedEvent, // FormData (Includes Image)
      });

      if (response.ok) {
        fetchEvents();
        setOpenModal(false);
        setSelectedEvent(null);
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Handle Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetch(`${BASE_URL}/event/deleteEvent/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents(); // Refresh the event list
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Table Columns
  const columns = [
    { field: "name", headerName: "Event Name", width: 200 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "type", headerName: "Type", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              setSelectedEvent(params.row);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // Prepare Data Rows
  const rows = events
    .filter((event) => (tab === 0 ? new Date(event.date) >= new Date() : new Date(event.date) < new Date()))
    .map((event) => ({
      id: event._id,
      name: event.name,
      date: new Date(event.date).toLocaleDateString(),
      type: event.type,
      status: new Date(event.date) >= new Date() ? "Upcoming" : "Past",
      ...event
    }));

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Manage Events
        </Typography>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mt: 3 }}>
          <Tab label="Upcoming Events" />
          <Tab label="Past Events" />
        </Tabs>

        <Paper sx={{ mt: 3, p: 2 }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </Paper>

        {/* Add Event Button */}
        <Button
          variant="contained"
          color="success"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
          onClick={() => setOpenModal(true)}
        >
          + Add Event
        </Button>

        {/* Event Modal */}
        {openModal && (
          <EventModal 
            open={openModal} 
            onClose={() => {
              setOpenModal(false);
              setSelectedEvent(null);
            }}
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
