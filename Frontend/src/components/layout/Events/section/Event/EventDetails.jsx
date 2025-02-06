import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Box,
  Avatar,
  Chip,
  Divider,
  AvatarGroup,
} from "@mui/material";
import { BASE_URL } from "../../../../../config";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import InfoIcon from "@mui/icons-material/Info";
import { toast } from "react-toastify"; 

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false); // Add state for button loader

  const token = localStorage.getItem("token");

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

  const handleRequest = async () => {
    setButtonLoading(true); // Start loading spinner on button
    try {
      const response = await fetch(`${BASE_URL}/event/request/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Request to join the event submitted successfully!");
      } else {
        toast.error(data.message || "Error requesting event.");
      }
    } catch (error) {
      toast.error("Error requesting event.");
      console.error(error);
    }
    setButtonLoading(false); // Stop loading spinner on button
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={70} thickness={4} sx={{ marginRight: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Loading Event Details...
        </Typography>
      </Box>
    );

  if (!event)
    return (
      <Typography variant="h6" textAlign="center">
        No event found
      </Typography>
    );

  const dummyParticipants = [
    {
      name: "Alice",
      avatar: "https://i.pravatar.cc/40?img=1",
      color: "#4285F4",
    },
    { name: "Bob", avatar: "https://i.pravatar.cc/40?img=2", color: "#DB4437" },
    {
      name: "Charlie",
      avatar: "https://i.pravatar.cc/40?img=3",
      color: "#F4B400",
    },
    {
      name: "David",
      avatar: "https://i.pravatar.cc/40?img=4",
      color: "#0F9D58",
    },
    { name: "Eve", avatar: "https://i.pravatar.cc/40?img=5", color: "#AB47BC" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 4,
        p: 4,
        flexWrap: "wrap",
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Left Section */}
      <Card
        sx={{
          width: 320,
          height: "fit-content",
          borderRadius: 3,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          position: { xs: "static", lg: "sticky" }, // Changes position based on breakpoint
          top: { xs: "auto", lg: 60 },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <img
            src={event.image || "https://via.placeholder.com/300"}
            alt={event.name}
            style={{
              width: "100%",
              borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />

          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
              Event Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <CalendarTodayIcon color="primary" />
                <Typography>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <AccessTimeIcon color="primary" />
                <Typography>{event.time}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LocationOnIcon color="primary" />
                <Typography>{event.location}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <PeopleIcon sx={{ mr: 1 }} /> Participants
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <AvatarGroup
                max={5}
                sx={{
                  "& .MuiAvatar-root": {
                    width: 45,
                    height: 45,
                    fontSize: "1.2rem",
                    border: "3px solid #fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    "&:hover": {
                      zIndex: 2,
                      transform: "scale(1.1)",
                      transition: "transform 0.2s",
                    },
                  },
                }}
              >
                {dummyParticipants.map((participant, index) => (
                  <Avatar
                    key={index}
                    src={participant.avatar}
                    alt={participant.name}
                    sx={{ bgcolor: participant.color }}
                  />
                ))}
              </AvatarGroup>
              <Typography variant="h6" color="text.secondary">
                {dummyParticipants.length} people going
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },
            }}
            onClick={handleRequest}
            disabled={buttonLoading} 
          >
            {buttonLoading ? (
              <CircularProgress size={24} sx={{ color: "black" }} />
            ) : (
              "Request to Join"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Right Section */}
      <Card
        sx={{
          flexGrow: 1,
          maxWidth: 800,
          borderRadius: 3,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontSize: "2.0rem",
              fontWeight: 600,
              color: "#1a73e8",
              mb: 3,
            }}
          >
            {event.name}
          </Typography>

          <Chip
            label={event.type}
            color="primary"
            sx={{
              borderRadius: 2,
              mb: 3,
              fontWeight: 500,
              "& .MuiChip-label": { px: 2 },
            }}
          />

          <Typography
            variant="body1"
            paragraph
            sx={{
              color: "#5f6368",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            {event.description}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* Agenda Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                fontWeight: 500,
                color: "#1a73e8",
              }}
            >
              <ListAltIcon sx={{ mr: 1 }} /> Agenda
            </Typography>
            {event.agenda?.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "#f8f9fa",
                  "&:hover": {
                    bgcolor: "#f1f3f4",
                    transform: "translateX(8px)",
                    transition: "all 0.2s",
                  },
                }}
              >
                <Typography sx={{ color: "#3c4043" }}>{item}</Typography>
              </Box>
            ))}
          </Box>

          {/* Prizes Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                fontWeight: 500,
                color: "#1a73e8",
              }}
            >
              <EmojiEventsIcon sx={{ mr: 1 }} /> Prizes
            </Typography>
            {event.prizes?.map((prize, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "#e8f0fe",
                  borderLeft: "4px solid #1a73e8",
                }}
              >
                <Typography sx={{ color: "#3c4043" }}>{prize}</Typography>
              </Box>
            ))}
          </Box>

          {/* Key Takeaways */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                fontWeight: 500,
                color: "#1a73e8",
              }}
            >
              <StarIcon sx={{ mr: 1 }} /> Key Takeaways
            </Typography>
            {event.keyTakeaways?.map((takeaway, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: "#fce8e6",
                  borderLeft: "4px solid #ea4335",
                }}
              >
                <Typography sx={{ color: "#3c4043" }}>{takeaway}</Typography>
              </Box>
            ))}
          </Box>

          {event.specialNotes && (
            <Box
              sx={{
                p: 3,
                bgcolor: "#fffde7",
                borderRadius: 2,
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <InfoIcon color="warning" />
              <Typography>{event.specialNotes}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          <iframe
            title="Event Location"
            width="100%"
            height="300"
            style={{
              border: 0,
              borderRadius: 16,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              event.location
            )}&output=embed`}
          ></iframe>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventDetails;
