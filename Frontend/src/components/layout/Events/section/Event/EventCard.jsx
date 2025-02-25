import React from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  CardMedia, 
  Button, 
  Box, 
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaChevronRight,
  FaCheck
} from "react-icons/fa";

const EventCard = ({ event, isPast = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
        boxShadow: isPast 
          ? "0 4px 12px rgba(0, 0, 0, 0.05)" 
          : "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        opacity: isPast ? 0.85 : 1,
        overflow: 'hidden',
        position: 'relative',
        "&:hover": {
          transform: isPast ? "none" : "translateY(-8px)",
          boxShadow: isPast 
            ? "0 4px 12px rgba(0, 0, 0, 0.05)" 
            : "0 10px 25px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      {/* Status badge for past events */}
      {isPast && (
        <Chip
          label="Past Event"
          size="small"
          icon={<FaCheck size={12} />}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            fontWeight: 500,
            fontSize: '0.7rem',
          }}
        />
      )}
      
      {/* Event Image with gradient overlay */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={event.image || "https://source.unsplash.com/random/600x180/?event"}
          alt={event.name}
          sx={{
            objectFit: "cover",
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            height: '50%',
          }}
        />
        
        {/* Date chip */}
        <Chip
          label={formatDate(event.date)}
          icon={<FaCalendarAlt size={14} />}
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          }}
        />
      </Box>
      
      {/* Card Content */}
      <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
        <Typography 
          variant="h6" 
          component="div" 
          color="primary" 
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            lineHeight: 1.4,
            minHeight: '3.6em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.name}
        </Typography>
        
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FaMapMarkerAlt size={16} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {event.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <FaClock size={16} color={theme.palette.text.secondary} />
            <Typography variant="body2" color="text.secondary">
              {event.time}
            </Typography>
          </Box>
        </Stack>
        
        {/* Truncated Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden', 
            mb: 2,
            opacity: 0.9,
          }}
        >
          {event.description}
        </Typography>
      </CardContent>

      {/* Button to View Details */}
      <Box sx={{ p: isMobile ? 2 : 3, pt: 0, mt: 'auto' }}>
        <Button
          variant={isPast ? "outlined" : "contained"}
          color="primary"
          fullWidth
          onClick={() => navigate(`/event-details/${event._id}`)}
          endIcon={<FaChevronRight />}
          sx={{
            borderRadius: "8px",
            fontWeight: 600,
            padding: "10px 20px",
            textTransform: 'none',
            boxShadow: isPast ? 'none' : 2,
          }}
        >
          {isPast ? "View Summary" : "View Details"}
        </Button>
      </Box>
    </Card>
  );
};

export default EventCard;