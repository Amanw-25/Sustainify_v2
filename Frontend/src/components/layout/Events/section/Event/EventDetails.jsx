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
  Container,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Fade,
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
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 200) + 50);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/event/getEventById/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setTimeout(() => {
            setEvent(data.event);
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

    fetchEventDetails();
    const timer = setTimeout(() => setViewCount(prev => prev + 1), 10000);
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
        toast.success("🎉 Request to join the event submitted successfully!");
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
      navigator.share({
        title: event?.name,
        text: `Check out this event: ${event?.name}`,
        url: window.location.href,
      }).catch(err => console.error('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const toggleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Removed from favorites" : "Added to favorites");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(to bottom right, #f5f7fa, #e4e8f0)",
        }}
      >
        <CircularProgress 
          size={80} 
          thickness={4} 
          sx={{ 
            color: theme.palette.primary.main,
            mb: 3,
            boxShadow: '0 0 20px rgba(0,0,0,0.05)'
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            textAlign: 'center',
            maxWidth: '80%',
            animation: 'pulse 2s infinite'
          }}
        >
          Loading Event Details...
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: '0.9rem', textAlign: 'center' }}
          >
            Preparing an amazing experience for you
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 6, 
            borderRadius: 4,
            background: 'linear-gradient(to bottom right, #ffffff, #f7f9fc)'
          }}
        >
          <Typography variant="h4" color="error" gutterBottom sx={{ fontWeight: 600 }}>
            Event Not Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            We couldn't find the event you're looking for. It may have been removed or is no longer available.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ 
              borderRadius: 2,
              py: 1.2,
              px: 3,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Back to Events
          </Button>
        </Paper>
      </Container>
    );
  }

  const eventDate = new Date(event.date);
  const today = new Date();
  const daysRemaining = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
  const isPastEvent = daysRemaining < 0;

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
      {/* Event Header Banner */}
      <Box
  sx={{
    position: "relative",
    height: { xs: 260, md: 340 },
    width: "100%",
    overflow: "hidden",
    mb: { xs: 10, md: 12 },
  }}
>
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "0%",
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${
        event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop"
      })`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 0,
    }}
  />

  <Container maxWidth="lg" sx={{ position: "relative", height: "100%" }}>
    <Box sx={{ position: "absolute", top: 20, left: 24, zIndex: 2 }}>
      <IconButton
        onClick={handleGoBack}
        sx={{
          color: "white",
          bgcolor: "rgba(0,0,0,0.3)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>

    <Box
      sx={{
        position: "absolute",
        bottom: { xs: -60, md: -70 },
        width: "100%",
        display: "flex",
        justifyContent: { xs: "center", md: "space-between" },
        alignItems: { xs: "center", md: "flex-end" },
        flexDirection: { xs: "column", md: "row" },
        zIndex: 2,
        px: { xs: 2, md: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-end" },
          gap: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: { xs: 110, md: 150 },
            height: { xs: 110, md: 150 },
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: isPastEvent ? "#f5f5f5" : "white",
            border: isPastEvent ? "2px solid #e0e0e0" : "none",
          }}
        >
          <Typography
            variant="h4"
            color={isPastEvent ? "text.disabled" : "error"}
            sx={{ fontWeight: 700, lineHeight: 1 }}
          >
            {isPastEvent ? "PAST" : Math.abs(daysRemaining)}
          </Typography>
          <Typography variant="body2" color={isPastEvent ? "text.disabled" : "text.primary"}>
            {isPastEvent ? "EVENT" : daysRemaining === 1 ? "DAY LEFT" : "DAYS LEFT"}
          </Typography>
        </Paper>

        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "white",
              textShadow: "0 2px 6px rgba(0,0,0,0.4)",
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              mb: 1,
            }}
          >
            {event.name}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
            <Chip
              label={event.type}
              color="primary"
              sx={{
                borderRadius: 6,
                fontWeight: 600,
                "& .MuiChip-label": { px: 2 },
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />

            <Chip
              icon={<VisibilityIcon sx={{ fontSize: "1rem !important" }} />}
              label={`${viewCount} views`}
              variant="outlined"
              sx={{
                borderRadius: 6,
                color: "white",
                borderColor: "rgba(255,255,255,0.5)",
                "& .MuiChip-icon": { color: "white" },
                bgcolor: "rgba(255,255,255,0.1)",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: { xs: 3, md: 0 } }}>
        <Tooltip title={liked ? "Remove from favorites" : "Add to favorites"}>
          <IconButton
            onClick={toggleLike}
            sx={{
              color: liked ? "#f44336" : "white",
              bgcolor: "rgba(255,255,255,0.2)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              transition: "all 0.2s",
            }}
          >
            {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Share event">
          <IconButton
            onClick={handleShare}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.2)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  </Container>
</Box>


      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column - Event Details */}
          <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ mb: 5 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "#1a73e8",
                      display: "flex",
                      alignItems: "center",
                      "&::after": {
                        content: '""',
                        display: 'block',
                        height: '2px',
                        width: '60px',
                        backgroundColor: '#1a73e8',
                        marginLeft: '12px',
                        borderRadius: '2px',
                      }
                    }}
                  >
                    About This Event
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#424242",
                      fontSize: "1.1rem",
                      lineHeight: 1.7,
                      mt: 2,
                    }}
                  >
                    {event.description}
                  </Typography>
                </Box>

                {/* Agenda Section */}
                <Box sx={{ mb: 5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      fontWeight: 600,
                      color: "#1a73e8",
                    }}
                  >
                    <ListAltIcon sx={{ mr: 1.5 }} /> Event Agenda
                  </Typography>

                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: "20px",
                        top: "30px",
                        bottom: "20px",
                        width: "2px",
                        bgcolor: "#e0e0e0",
                        zIndex: 0,
                      }}
                    />

                    {event.agenda?.map((item, index) => (
                      <Fade in={true} key={index} timeout={500 + index * 100}>
                        <Box
                          sx={{
                            position: "relative",
                            pl: 5,
                            pb: 3,
                            zIndex: 1,
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: "2px",
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              bgcolor: theme.palette.primary.main,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                          >
                            {index + 1}
                          </Box>

                          <Paper
                            sx={{
                              p: 2.5,
                              borderRadius: 3,
                              bgcolor: "#f8f9fa",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                              transition: "all 0.3s",
                              border: "1px solid rgba(0,0,0,0.04)",
                              "&:hover": {
                                transform: "translateX(8px)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                bgcolor: "#f1f3f4",
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#3c4043",
                                fontWeight: 500,
                              }}
                            >
                              {item}
                            </Typography>
                          </Paper>
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </Box>

                {/* Prizes Section */}
                {event.prizes?.length > 0 && (
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        fontWeight: 600,
                        color: "#1a73e8",
                      }}
                    >
                      <EmojiEventsIcon sx={{ mr: 1.5 }} /> Prizes & Rewards
                    </Typography>

                    <Grid container spacing={2}>
                      {event.prizes?.map((prize, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Paper
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              textAlign: "center",
                              background: "linear-gradient(to bottom right, #e8f0fe, #f5f9ff)",
                              boxShadow: "0 4px 10px rgba(26,115,232,0.15)",
                              border: "1px solid #bfdaff",
                              transition: "all 0.3s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 16px rgba(26,115,232,0.2)",
                              },
                            }}
                          >
                            <EmojiEventsIcon
                              sx={{
                                fontSize: 40,
                                color: ["#FFD700", "#C0C0C0", "#CD7F32"][index] || "#1a73e8",
                                mb: 1.5,
                              }}
                            />
                            <Typography
                              sx={{
                                color: "#3c4043",
                                fontWeight: 600,
                                fontSize: "1.05rem",
                              }}
                            >
                              {prize}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Key Takeaways */}
                {event.keyTakeaways?.length > 0 && (
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        fontWeight: 600,
                        color: "#1a73e8",
                      }}
                    >
                      <StarIcon sx={{ mr: 1.5 }} /> Key Takeaways
                    </Typography>

                    <Grid container spacing={2.5}>
                      {event.keyTakeaways?.map((takeaway, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              display: "flex",
                              gap: 2,
                              alignItems: "flex-start",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                              transition: "all 0.2s",
                              bgcolor: "#fff9f9",
                              borderLeft: "4px solid #ea4335",
                              "&:hover": {
                                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                bgcolor: "#fff5f5",
                              },
                            }}
                          >
                            <Box 
                              sx={{ 
                                bgcolor: "rgba(234,67,53,0.1)", 
                                borderRadius: "50%",
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <StarIcon sx={{ color: "#ea4335" }} />
                            </Box>
                            <Typography sx={{ color: "#3c4043", flex: 1 }}>{takeaway}</Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {event.specialNotes && (
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: "#fffde7",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mb: 5,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      borderLeft: "4px solid #ffa000",
                    }}
                  >
                    <InfoIcon sx={{ color: "#ffa000" }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Special Notes
                      </Typography>
                      <Typography>{event.specialNotes}</Typography>
                    </Box>
                  </Paper>
                )}

                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      fontWeight: 600,
                      color: "#1a73e8",
                    }}
                  >
                    <LocationOnIcon sx={{ mr: 1.5 }} /> Event Location
                  </Typography>

                  <Paper 
                    elevation={4}
                    sx={{
                      p: 0,
                      borderRadius: 4,
                      overflow: "hidden",
                      height: 350,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}
                  >
                    <iframe
                      title="Event Location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                    />
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Action Panel & Event Info */}
          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.06)",
                  bgcolor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  mb: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#1a73e8" }}>
                      Event Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            bgcolor: "#f5f9ff",
                            border: "1px solid #e1ecff",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "rgba(26, 115, 232, 0.1)",
                              color: "#1a73e8",
                            }}
                          >
                            <CalendarTodayIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Date
                            </Typography>
                            <Typography fontWeight={500}>
                              {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            bgcolor: "#f5f9ff",
                            border: "1px solid #e1ecff",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "rgba(26, 115, 232, 0.1)",
                              color: "#1a73e8",
                            }}
                          >
                            <AccessTimeIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Time
                            </Typography>
                            <Typography fontWeight={500}>{event.time}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            bgcolor: "#f5f9ff",
                            border: "1px solid #e1ecff",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "rgba(26, 115, 232, 0.1)",
                              color: "#1a73e8",
                            }}
                          >
                            <LocationOnIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Location
                            </Typography>
                            <Typography fontWeight={500}>{event.location}</Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        color: "#1a73e8",
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
                            width: 50,
                            height: 50,
                            fontSize: "1.2rem",
                            border: "3px solid #fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                            "&:hover": {
                              zIndex: 2,
                              transform: "scale(1.2)",
                              transition: "transform 0.3s",
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
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventDetails;