import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const EventRequestForm = ({ event, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save request to backend or local storage (dummy for now)
    const newRequest = { id: Date.now(), eventTitle: event.title, name, email, status: "Pending" };
    let requests = JSON.parse(localStorage.getItem("eventRequests")) || [];
    requests.push(newRequest);
    localStorage.setItem("eventRequests", JSON.stringify(requests));

    alert("Your request has been sent! You'll be notified once approved.");
    onClose();
  };

  return (
    <Box sx={{ padding: "20px", textAlign: "center" }}>
      <Typography variant="h6" fontWeight="bold">Request to Join: {event.title}</Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          type="email"
          label="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mt: 2 }}
        />
        
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Request Access
        </Button>
      </form>
    </Box>
  );
};

export default EventRequestForm;
