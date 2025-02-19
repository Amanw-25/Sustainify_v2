import React, { useState, useEffect } from "react";
import { 
  Grid, 
  CircularProgress, 
  Box, 
  Typography, 
  Container, 
  useTheme, 
  useMediaQuery,
  Tabs,
  Tab,
  Fade,
  Alert,
  Divider,
  Pagination,
  Button,
  Paper
} from "@mui/material";
import { FaCalendarAlt, FaHistory, FaStar, FaArrowRight, FaBell } from "react-icons/fa";
import EventCard from "./EventCard";
import { BASE_URL } from "../../../../../config";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Items per page
  const ITEMS_PER_PAGE = isMobile ? 3 : isTablet ? 6 : 9;

  // Unsplash collection URLs for event images
  const eventImageUrls = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop"
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/event/getAllEvents`);
        const data = await response.json();

        if (response.ok) {
          // Add random image URLs to events that don't have images
          const eventsWithImages = data.events.map((event, index) => ({
            ...event,
            image: event.image || eventImageUrls[index % eventImageUrls.length]
          }));
          
          setEvents(eventsWithImages);
          
          // Get today's date
          const today = new Date();
          
          // Filter upcoming events
          const upcoming = eventsWithImages.filter(event => new Date(event.date) >= today);
          
          // Sort by date (closest first)
          upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
          
          // Set featured events (for carousel)
          setFeaturedEvents(upcoming.slice(0, 3));
          
          // Set latest events (for the 2-event display)
          setLatestEvents(upcoming.slice(0, 2));
          
          setError(null);
        } else {
          setError(data.message || "Failed to load events");
        }
      } catch (err) {
        setError("Network error while fetching events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading events...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Typography variant="body1" align="center">
          Please try again later or contact support.
        </Typography>
      </Container>
    );
  }

  // Get today's date
  const today = new Date();

  // Separate events into past and upcoming
  const upcomingEvents = events.filter(event => new Date(event.date) >= today);
  const pastEvents = events.filter(event => new Date(event.date) < today);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Pagination logic
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll to top of event list
    document.getElementById("event-list").scrollIntoView({ behavior: "smooth" });
  };

  // Get current events based on pagination
  const getCurrentEvents = () => {
    const currentEvents = activeTab === 0 ? upcomingEvents : pastEvents;
    const indexOfLastEvent = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstEvent = indexOfLastEvent - ITEMS_PER_PAGE;
    return currentEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  };

  // Calculate total pages
  const totalPages = Math.ceil(
    (activeTab === 0 ? upcomingEvents.length : pastEvents.length) / ITEMS_PER_PAGE
  );

  // Latest Event Card
  const LatestEventCard = ({ event }) => (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
        height: isMobile ? 'auto' : 220,
        borderRadius: '12px',
        boxShadow: theme.shadows[3],
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[6],
        }
      }}
    >
      <Box
        sx={{
          width: isMobile ? '100%' : 220,
          height: isMobile ? 180 : '100%',
          flexShrink: 0,
          backgroundImage: `url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '6px',
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FaCalendarAlt size={14} style={{ marginRight: '6px' }} />
          <Typography variant="caption" fontWeight={600}>
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        p: 2.5, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </Typography>
        </div>
        
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<FaArrowRight size={12} />}
          sx={{ 
            alignSelf: 'flex-start',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 500,
            px: 2,
          }}
          onClick={() => window.location.href = `/event-details/${event._id}`}
        >
          View Details
        </Button>
      </Box>
    </Paper>
  );

  return (
    <>
      {/* Full-width Banner */}
      <Box
        sx={{
          width: '100%',
          py: { xs: 6, md: 8 },
          px: 2,
          mb: 6,
          backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
            backgroundSize: '30px 30px',
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  textShadow: '0px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Join Our Community Events
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 400,
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '90%'
                }}
              >
                Discover upcoming activities, workshops, and gatherings to connect with like-minded individuals
              </Typography>
              
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<FaArrowRight />}
                sx={{ 
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: theme.shadows[4]
                }}
                onClick={() => document.getElementById("event-list").scrollIntoView({ behavior: "smooth" })}
              >
                Explore Events
              </Button>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop"
                alt="Community Event"
                sx={{
                  width: '100%',
                  maxHeight: 300,
                  objectFit: 'cover',
                  borderRadius: '16px',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                  transform: 'rotate(2deg)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Latest Events Section */}
        {latestEvents.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FaBell size={20} color={theme.palette.primary.main} />
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ ml: 1.5, fontWeight: 700 }}
                >
                  Latest Events
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                color="primary"
                endIcon={<FaArrowRight size={14} />}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
                onClick={() => document.getElementById("event-list").scrollIntoView({ behavior: "smooth" })}
              >
                View All
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {latestEvents.map((event) => (
                <Grid item xs={12} md={6} key={event._id}>
                  <LatestEventCard event={event} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Page Title */}
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontWeight: 700, 
            color: theme.palette.primary.main, 
            mb: 4,
            letterSpacing: 0.5
          }}
        >
          Community Events
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {/* Event List Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            mb: 4,
            '& .MuiTab-root': {
              fontWeight: 600,
              py: 2
            }
          }}
        >
          <Tab 
            icon={<FaCalendarAlt />} 
            iconPosition="start" 
            label={`Upcoming (${upcomingEvents.length})`} 
          />
          <Tab 
            icon={<FaHistory />} 
            iconPosition="start" 
            label={`Past (${pastEvents.length})`} 
          />
        </Tabs>

        {/* Event list container with id for pagination scrolling */}
        <div id="event-list">
          <Fade in={activeTab === 0} timeout={500}>
            <div style={{ display: activeTab === 0 ? 'block' : 'none' }}>
              {upcomingEvents.length > 0 ? (
                <>
                  <Grid container spacing={isMobile ? 3 : 4}>
                    {getCurrentEvents().map((event) => (
                      <Grid item key={event._id} xs={12} sm={6} md={4}>
                        <EventCard event={event} />
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination 
                        count={totalPages} 
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "medium" : "large"}
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No upcoming events scheduled
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Check back soon for new events
                  </Typography>
                </Box>
              )}
            </div>
          </Fade>

          <Fade in={activeTab === 1} timeout={500}>
            <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
              {pastEvents.length > 0 ? (
                <>
                  <Grid container spacing={isMobile ? 3 : 4}>
                    {getCurrentEvents().map((event) => (
                      <Grid item key={event._id} xs={12} sm={6} md={4}>
                        <EventCard event={event} isPast />
                      </Grid>
                    ))}
                  </Grid>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                      <Pagination 
                        count={totalPages} 
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size={isMobile ? "medium" : "large"}
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No past events to display
                  </Typography>
                </Box>
              )}
            </div>
          </Fade>
        </div>
      </Container>
    </>
  );
};

export default EventPage;