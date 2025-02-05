import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button, CircularProgress } from "@mui/material";
import { BASE_URL } from '../../../../../config';


const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/event/getEventById/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data.event);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!event) return <Typography>No event found</Typography>;

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 5, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4">{event.name}</Typography>
        <Typography variant="body1">📅 Date: {new Date(event.date).toLocaleDateString()}</Typography>
        <Typography variant="body1">📍 Location: {event.location}</Typography>
        <Typography variant="body1">🕒 Time: {event.time}</Typography>
        <Typography variant="body1">🎭 Type: {event.type.toUpperCase()}</Typography>
        <Button
          variant="contained"
          color="success"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => window.location.href = `/request-event/${event._id}`}
        >
          Request to Join
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventDetails;
