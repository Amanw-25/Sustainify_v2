import React, { useState } from "react";
import { Button, Typography, TextField, Box, CircularProgress } from "@mui/material";
import { BASE_URL } from "../../../../../config.js";

const MeetingComponent = ({ eventId }) => {
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);

  const createMeeting = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/event/createMeeting/${eventId}`, {
        method: "POST",
      });
      const data = await response.json();
      setMeetingLink(data.meetingUrl);
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h5">Online Meeting</Typography>
      <Button variant="contained" color="primary" onClick={createMeeting} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Generate Meeting Link"}
      </Button>
      {meetingLink && (
        <TextField
          fullWidth
          margin="normal"
          value={meetingLink}
          variant="outlined"
          InputProps={{ readOnly: true }}
          sx={{ mt: 2 }}
        />
      )}
    </Box>
  );
};

export default MeetingComponent;
