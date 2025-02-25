import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Grid, Box, CircularProgress, Typography, Paper, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { BASE_URL } from "../../../../../../config";
import { toast } from "react-toastify";

import EventHeader from "./EventHeader";
import EventDetailsCard from "./EventDetailsCard";
import EventInfoCard from "./EventInfoCard";
import LoadingScreen from "./LoadingScreen";
import EventNotFound from "./EventNotFound";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [viewCount, setViewCount] = useState(
    Math.floor(Math.random() * 200) + 50
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEventDetails = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/event/getEventById/${id}`);
//         const data = await response.json();

//         if (response.ok) {
//           const parsedEvent = {
//             ...data.event,
//             agenda: parseArrayField(data.event.agenda),
//             prizes: parseArrayField(data.event.prizes),
//             keyTakeaways: parseArrayField(data.event.keyTakeaways)
//           };

//           setTimeout(() => {
//             setEvent(parsedEvent);
//             setLoading(false);
//           }, 800);
//         } else {
//           toast.error("Failed to load event details");
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Error fetching event:", err);
//         toast.error("An error occurred while loading event details");
//         setLoading(false);
//       }
//     };

//     const parseArrayField = (field) => {
//       if (!field) return [];
//       if (Array.isArray(field)) return field;
//       try {
//         return JSON.parse(field);
//       } catch (e) {
//         console.error("Error parsing field:", e);
//         return Array.isArray(field) ? field : [field];
//       }
//     };

//     fetchEventDetails();
//     const timer = setTimeout(() => setViewCount((prev) => prev + 1), 10000);
//     return () => clearTimeout(timer);
//   }, [id]);

useEffect(() => {
    const fetchEventDetails = async () => {
        try {
          const response = await fetch(`${BASE_URL}/event/getEventById/${id}`);
          const data = await response.json();
  
          if (response.ok) {
            const parsedEvent = {
              ...data.event,
              agenda: parseArrayField(data.event.agenda),
              prizes: parseArrayField(data.event.prizes),
              keyTakeaways: parseArrayField(data.event.keyTakeaways)
            };
  
            setTimeout(() => {
              setEvent(parsedEvent);
              setLoading(false);
            }, 800);
          } else {
            toast.error("Failed to load event details");
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching event:", err);
          toast.error("An error occurred while loading event details");
          setLoading(false);
        }
      };

    const parseArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        return JSON.parse(field);
      } catch (e) {
        console.error("Error parsing field:", e);
        return Array.isArray(field) ? field : [field];
      }
    };

    fetchEventDetails();
    const timer = setTimeout(() => setViewCount((prev) => prev + 1), 10000);
    return () => clearTimeout(timer);
  }, [id]);



  const handleRequest = async () => {
    setButtonLoading(true);
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
    setButtonLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.name,
          text: `Check out this event: ${event?.name}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleGoBack = () => {
    navigate('/event');
  };

  const toggleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!event) {
    return <EventNotFound handleGoBack={handleGoBack} />;
  }

  // Calculate days remaining for the event
  const eventDate = new Date(event.date);
  const today = new Date();
  const daysRemaining = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
  const isPastEvent = daysRemaining < 0;

  // Dummy participants data
  const dummyParticipants = [
    { name: "Alice", avatar: "https://i.pravatar.cc/150?img=1", color: "#4285F4" },
    { name: "Bob", avatar: "https://i.pravatar.cc/150?img=2", color: "#DB4437" },
    { name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3", color: "#F4B400" },
    { name: "David", avatar: "https://i.pravatar.cc/150?img=4", color: "#0F9D58" },
    { name: "Eve", avatar: "https://i.pravatar.cc/150?img=5", color: "#AB47BC" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f0f4f8 0%, #f8fafc 100%)",
        pt: { xs: 2, md: 4 },
        pb: 8,
      }}
    >
      <EventHeader 
        event={event}
        daysRemaining={daysRemaining}
        isPastEvent={isPastEvent}
        handleGoBack={handleGoBack}
        handleShare={handleShare}
        liked={liked}
        toggleLike={toggleLike}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column - Event Details */}
          <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
            <EventDetailsCard event={event} />
          </Grid>

          {/* Right Column - Action Panel & Event Info */}
          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
            <EventInfoCard 
              event={event}
              dummyParticipants={dummyParticipants}
              handleRequest={handleRequest}
              buttonLoading={buttonLoading}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventDetails;