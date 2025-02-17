import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";

const BadgeView = () => {
  const { badgeId } = useParams();
  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadgeDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/badge/badges/${badgeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch badge details");
        }

        const data = await response.json();
        console.log(data);
        setBadge(data);
      } catch (error) {
        console.error("Error fetching badge details:", error);
        toast.error("Error loading badge information.");
      } finally {
        setLoading(false);
      }
    };

    if (badgeId) {
      fetchBadgeDetails();
    }
  }, [badgeId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!badge) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Badge not found
          </Typography>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* Header with gradient background */}
          <Box
            sx={{
              background: "linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)",
              p: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", color: "white", mb: 2 }}
            >
              Badge Achievement
            </Typography>
          </Box>

          <Box
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "white",
                border: "6px solid #f6d365",
                boxShadow: 3,
                mb: 3,
              }}
            >
              {badge.icon ? (
                badge.icon
              ) : (
                <TrophyIcon sx={{ color: "#FFD700", fontSize: 60 }} />
              )}
            </Avatar>

            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
            >
              {badge.badge.name}
            </Typography>

            <Divider sx={{ width: "60%", my: 2 }} />

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center", maxWidth: "80%" }}
            >
              {badge.description || "Achievement unlocked!"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Chip
                label={`Earned: ${new Date(
                  badge.badge.earnedDate
                ).toLocaleDateString()}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", textAlign: "center" }}
            >
              This badge was earned for eco-friendly efforts in reducing carbon
              footprint.
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "action.hover",
              p: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Join the sustainability movement and earn your own badges!
            </Typography>
            <Button
              variant="contained"
              component={Link}
              to="/register"
              sx={{ mt: 2 }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BadgeView;
