import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { BASE_URL } from '../../../../../config';

const RequestEvent = () => {
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleRequest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/event/request/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        
      });
      const data = await response.json();
      setMessage(data.message || "Request submitted successfully.");
    } catch (error) {
      setMessage("Error requesting event.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h5">Request to Join Event</Typography>
      <Button variant="contained" color="primary" onClick={handleRequest} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Submit Request"}
      </Button>
      {message && <Typography sx={{ mt: 2, color: "green" }}>{message}</Typography>}
    </Box>
  );
};

export default RequestEvent;
