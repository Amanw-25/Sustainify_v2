import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Tabs, Tab, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "../Global/Sidebar";
import EventModal from "./AddEventModal";
import { BASE_URL } from "../../../../config.js";

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem("token");

  const columns = [
    { field: "name", headerName: "Event Name", width: 200 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "time", headerName: "Time", width: 100 },
    { field: "type", headerName: "Type", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={2} justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{ mt: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            sx={{ mt: 1 }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

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

  const handleAddEvent = async (newEvent) => {
    try {
      const response = await fetch(`${BASE_URL}/event/addEvent`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: newEvent,
      });
      if (response.ok) handleSuccess();
    } catch (error) {
      console.error("Error adding event:", error);
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
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetch(`${BASE_URL}/event/deleteEvent/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
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
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const processRows = () =>
    events
      .filter((event) =>
        tab === 0
          ? new Date(event.date) >= new Date()
          : new Date(event.date) < new Date()
      )
      .map((event) => ({
        id: event._id,
        name: event.name,
        date: event.date.split('T')[0],
        time: event.date.split('T')[1].substring(0, 5),
        type: event.type,
        status: new Date(event.date) >= new Date() ? "Upcoming" : "Past",
        ...event,
      }));

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Manage Events
        </Typography>

        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{ mt: 3 }}
        >
          <Tab label="Upcoming Events" />
          <Tab label="Past Events" />
        </Tabs>

        <Paper sx={{ mt: 3, p: 2 }}>
          <DataGrid rows={processRows()} columns={columns} pageSize={5} />
        </Paper>

        <Button
          variant="contained"
          color="success"
          sx={{ position: "fixed", bottom: 20, right: 20 }}
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