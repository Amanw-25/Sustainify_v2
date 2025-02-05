import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import EventList from './section/EventList';
import EventRequestForm from "./section/EventRequestForm";

const EventsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleRequestJoin = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <EventList onRequestJoin={handleRequestJoin} />

      {/* Request to Join Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ padding: "20px", backgroundColor: "white", maxWidth: "500px", margin: "auto", marginTop: "100px" }}>
          <EventRequestForm event={selectedEvent} onClose={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
};

export default EventsPage;
