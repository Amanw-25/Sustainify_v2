import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Modal,
  Paper,
  Grid,
  Avatar,
  Divider,
  Chip,
  Fade,
  CircularProgress,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Close as CloseIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import {
  FaTrophy,
  FaMedal,
  FaLeaf,
  FaAward,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { ResponsiveLine } from "@nivo/line";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";

const CarbonFootprint = () => {
  const [footprintData, setFootprintData] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    fetchCarbonData();
    fetchBadges();
  }, []);

  const fetchCarbonData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/carbon/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch carbon data");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        toast.warn("No carbon footprint data available.");
        setLoading(false);
        return;
      }

      // Transforming API response into Nivo-friendly format (Only Total Emissions)
      const transformedData = [
        {
          id: "Total Emissions",
          color: "hsl(96, 70%, 50%)",
          data: data.map((entry, index) => ({
            x: `Reading ${index + 1}`, // Label for the x-axis
            y: entry.Total || 0, // Total Emissions
          })),
        },
      ];

      setFootprintData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching carbon data:", error);
      toast.error("Error fetching carbon footprint data.");
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch(`${BASE_URL}/badge/badges`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch badges");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        toast.warn("No badges earned yet.");
        return;
      }

      setBadges(data.badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      toast.error("Error fetching badges.");
    }
  };

  const handleShareClick = (event, badge) => {
    setShareMenuAnchor(event.currentTarget);
    setSelectedBadge(badge);
  };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const handleShareSocial = (platform) => {
    if (!selectedBadge) return;
    console.log("Sharing badge on", platform);
    console.log("Selected Badge:", selectedBadge);
  
    const shareText = `I just earned the ${selectedBadge.name} badge for my eco-friendly efforts in reducing my carbon footprint!`;
    
    // Create a specific URL for the badge, including the badge ID
    const badgeUrl = `${window.location.origin}/badges/${selectedBadge._id}`;
    let shareUrl = '';
  
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(badgeUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(badgeUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(badgeUrl)}&title=${encodeURIComponent(`${selectedBadge.name} Badge Earned`)}&summary=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${badgeUrl}`)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we'll show a message
        toast.info("To share on Instagram, take a screenshot of your badge and upload it to your Instagram story or post!");
        handleShareClose();
        return;
      default:
        break;
    }
  
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
    
    handleShareClose();
  };

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

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ flexGrow: 1, minWidth: "200px" }}
          >
            Carbon Footprint Tracker
          </Typography>
          <Button
            variant="contained"
            startIcon={<FaAward />}
            onClick={() => setOpenModal(true)}
            sx={{
              bgcolor: "#2E7D32",
              "&:hover": { bgcolor: "#1B5E20" },
              whiteSpace: "nowrap",
              mt: { xs: 2, sm: 0 },
            }}
          >
            See Your Badges
          </Button>
        </Box>

        {/* Badges Modal */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="badges-modal"
          closeAfterTransition
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: 800,
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 4,
                maxHeight: "80vh",
                overflow: "auto",
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              {/* Header with gradient background */}
              <Box
                sx={{
                  background:
                    "linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)",
                  p: 3,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TrophyIcon sx={{ color: "#FFD700", fontSize: 36, mr: 2 }} />
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: "bold", color: "white" }}
                  >
                    Your Achievement Badges
                  </Typography>
                </Box>
                <Button
                  onClick={() => setOpenModal(false)}
                  sx={{
                    minWidth: "auto",
                    p: 1,
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <CloseIcon />
                </Button>
              </Box>

              <Box sx={{ p: 4 }}>
                {badges.length === 0 ? (
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "action.disabledBackground",
                      }}
                    >
                      <TrophyIcon
                        sx={{ fontSize: 40, color: "text.disabled" }}
                      />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      You have no badges yet
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 400, mx: "auto" }}
                    >
                      Complete challenges and milestones to earn achievement
                      badges that will be displayed here.
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={3}>
                      {badges.map((badge) => (
                        <Grid item xs={12} sm={6} md={4} key={badge.id}>
                          <Paper
                            elevation={3}
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              transition:
                                "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-8px)",
                                boxShadow: 8,
                              },
                              borderRadius: 3,
                              overflow: "hidden",
                              position: "relative",
                            }}
                          >
                            {/* Share Button */}
                            <Tooltip title="Share Badge">
                              <IconButton
                                aria-label="share badge"
                                onClick={(e) => handleShareClick(e, badge)}
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  zIndex: 10,
                                  bgcolor: "rgba(255, 255, 255, 0.7)",
                                  "&:hover": {
                                    bgcolor: "rgba(255, 255, 255, 0.9)",
                                  },
                                }}
                                size="small"
                              >
                                <ShareIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Box
                              sx={{
                                width: "100%",
                                background:
                                  "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
                                pt: 3,
                                pb: 2,
                                display: "flex",
                                justifyContent: "center",
                                position: "relative",
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 70,
                                  height: 70,
                                  bgcolor: "white",
                                  border: "4px solid white",
                                  boxShadow: 2,
                                }}
                              >
                                {badge.icon ? (
                                  badge.icon
                                ) : (
                                  <TrophyIcon
                                    sx={{ color: "#FFD700", fontSize: 36 }}
                                  />
                                )}
                              </Avatar>
                            </Box>

                            <Box sx={{ p: 3, flexGrow: 1, width: "100%" }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  mb: 1,
                                }}
                              >
                                {badge.name}
                              </Typography>
                              <Divider sx={{ my: 1.5 }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  textAlign: "center",
                                  minHeight: "3em",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {badge.description || "Achievement unlocked!"}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                width: "100%",
                                p: 2,
                                bgcolor: "action.hover",
                                borderTop: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Chip
                                label={`Earned: ${new Date(
                                  badge.earnedDate
                                ).toLocaleDateString()}`}
                                size="small"
                                sx={{
                                  width: "100%",
                                  bgcolor: "background.paper",
                                  fontWeight: 500,
                                }}
                              />
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Box>

              {/* Share Menu */}
              <Menu
                anchorEl={shareMenuAnchor}
                open={Boolean(shareMenuAnchor)}
                onClose={handleShareClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    mt: 1,
                    width: 200,
                    '& .MuiMenu-list': {
                      p: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => handleShareSocial('whatsapp')}>
                  <ListItemIcon>
                    <FaWhatsapp style={{ color: '#25D366' }} />
                  </ListItemIcon>
                  <ListItemText>WhatsApp</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleShareSocial('twitter')}>
                  <ListItemIcon>
                    <FaTwitter style={{ color: '#1DA1F2' }} />
                  </ListItemIcon>
                  <ListItemText>Twitter</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleShareSocial('facebook')}>
                  <ListItemIcon>
                    <FaFacebook style={{ color: '#4267B2' }} />
                  </ListItemIcon>
                  <ListItemText>Facebook</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleShareSocial('linkedin')}>
                  <ListItemIcon>
                    <FaLinkedin style={{ color: '#0077B5' }} />
                  </ListItemIcon>
                  <ListItemText>LinkedIn</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleShareSocial('instagram')}>
                  <ListItemIcon>
                    <FaInstagram style={{ color: '#E1306C' }} />
                  </ListItemIcon>
                  <ListItemText>Instagram</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Fade>
        </Modal>

        <Paper elevation={3} sx={{ p: 3, height: 400, mb: 4 }}>
          <ResponsiveLine
            data={footprintData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Readings",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Total Emission (kg CO₂)",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default CarbonFootprint;