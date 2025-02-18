import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Avatar,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MdEvent,
  MdAccessTime,
  MdLocationOn,
  MdPeople,
  MdCheck,
  MdClose,
  MdInfo,
  MdRefresh,
  MdChevronRight,
  MdCalendarToday,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../config";
import { toast } from "react-toastify";

const Events = () => {
  const [eventRequests, setEventRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const scrollRef = useRef(null);

  // Calculate items per page based on screen size
  const getItemsPerPage = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(eventRequests.length / itemsPerPage);

  useEffect(() => {
    fetchEventRequests();
  }, []);

  const fetchEventRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/event/userRequests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch event requests");
      }

      const data = await response.json();
      setEventRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load event requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const navigateToEventPage = (eventId) => {
    if (eventId && eventId._id) {
      navigate(`/event-details/${eventId._id}`);
      handleCloseDialog();
    } else {
      toast.error("Cannot navigate to event: Event ID not found");
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return (
          <Chip
            icon={<MdCheck />}
            label="Approved"
            color="success"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      case "pending":
        return (
          <Chip
            icon={<MdAccessTime />}
            label="Pending"
            color="warning"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      case "rejected":
        return (
          <Chip
            icon={<MdClose />}
            label="Rejected"
            color="error"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      default:
        return (
          <Chip
            icon={<MdInfo />}
            label={status || "Unknown"}
            color="default"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
    }
  };

  const getRandomColor = () => {
    const colors = [
      "#4CAF50",
      "#2196F3",
      "#FF9800",
      "#9C27B0",
      "#E91E63",
      "#00BCD4",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Get current page requests
  const getCurrentPageRequests = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return eventRequests.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button
            variant="contained"
            startIcon={<MdRefresh />}
            onClick={fetchEventRequests}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "#3f51b5", mr: 2 }}>
              <MdEvent />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600, m: 0 }}
            >
              My Event Requests
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<MdRefresh />}
            onClick={fetchEventRequests}
            sx={{ bgcolor: "#3f51b5", "&:hover": { bgcolor: "#303f9f" } }}
          >
            Refresh
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {eventRequests.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "#f5f5f5",
            }}
          >
            <MdCalendarToday
              style={{ fontSize: 48, color: "#9e9e9e", marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              No event requests found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You haven't made any event requests yet.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate("/events")}
            >
              Explore Events
            </Button>
          </Paper>
        ) : (
          <Box>
            {/* Navigation controls */}
            <Box
              ref={scrollRef}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Showing {(currentPage - 1) * itemsPerPage + 1} -
                {Math.min(currentPage * itemsPerPage, eventRequests.length)} of{" "}
                {eventRequests.length} requests
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  sx={{
                    bgcolor: currentPage === 1 ? "#f5f5f5" : "#e3f2fd",
                    color: currentPage === 1 ? "#bdbdbd" : "#1976d2",
                    "&:hover": { bgcolor: "#bbdefb" },
                  }}
                >
                  <MdNavigateBefore />
                </IconButton>

                <Box sx={{ mx: 2, minWidth: "80px", textAlign: "center" }}>
                  <Typography variant="body1" fontWeight={500}>
                    {currentPage} / {totalPages}
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  sx={{
                    bgcolor: currentPage === totalPages ? "#f5f5f5" : "#e3f2fd",
                    color: currentPage === totalPages ? "#bdbdbd" : "#1976d2",
                    "&:hover": { bgcolor: "#bbdefb" },
                  }}
                >
                  <MdNavigateNext />
                </IconButton>
              </Box>
            </Box>

            {/* Event cards */}
            <Grid container spacing={3}>
              {getCurrentPageRequests().map((request) => {
                const eventDate = request.eventId?.date
                  ? new Date(request.eventId.date)
                  : null;
                const isPastEvent = eventDate && eventDate < new Date();

                return (
                  <Grid item xs={12} md={isTablet ? 6 : 4} key={request._id}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                        },
                        opacity: isPastEvent ? 0.7 : 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ height: 8, bgcolor: getRandomColor() }} />
                      <CardContent sx={{ pt: 3, flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          component="div"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: 48,
                          }}
                        >
                          {request.eventId?.name || "Untitled Event"}
                        </Typography>

                        <Box sx={{ mt: 1, mb: 2 }}>
                          {getStatusChip(request.status)}
                          {isPastEvent && (
                            <Chip
                              label="Past Event"
                              size="small"
                              sx={{
                                ml: 1,
                                bgcolor: "#e0e0e0",
                                fontWeight: 500,
                              }}
                            />
                          )}
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 2 }}
                        >
                          <MdAccessTime
                            style={{ marginRight: "8px", color: "#666" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {request.eventId?.date
                              ? new Date(
                                  request.eventId.date
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "TBD"}
                            {request.eventId?.time
                              ? ` • ${request.eventId.time}`
                              : ""}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <MdLocationOn
                            style={{ marginRight: "8px", color: "#666" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {request.eventId?.location ||
                              "Location not specified"}
                          </Typography>
                        </Box>

                        {request.requestDate && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <MdInfo
                              style={{ marginRight: "8px", color: "#666" }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Requested:{" "}
                              {new Date(request.requestDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      <CardActions
                        sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleViewDetails(request)}
                          startIcon={<MdInfo />}
                          sx={{ color: "#3f51b5" }}
                        >
                          View Details
                        </Button>

                        {request.status === "approved" && (
                          <Button
                            size="small"
                            endIcon={<MdChevronRight />}
                            onClick={() => navigateToEventPage(request.eventId)}
                            sx={{ color: "#3f51b5" }}
                          >
                            Go to Event
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Pagination for larger screens */}
            {!isMobile && eventRequests.length > itemsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                  size={isTablet ? "small" : "medium"}
                />
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Event Request Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        {selectedRequest && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: 600, pr: 6 }}
              >
                {selectedRequest.eventId?.name || "Event Request Details"}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <MdClose />
              </IconButton>
            </DialogTitle>

            <Box sx={{ px: 3, pb: 1 }}>
              {getStatusChip(selectedRequest.status)}
            </Box>

            <DialogContent dividers>
              <DialogContentText component="div">
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                  <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2", mr: 2 }}>
                    <MdAccessTime />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.eventId?.date
                        ? new Date(
                            selectedRequest.eventId.date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "TBD"}
                      {selectedRequest.eventId?.time
                        ? ` at ${selectedRequest.eventId.time}`
                        : ""}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
                  <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", mr: 2 }}>
                    <MdLocationOn />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Location
                    </Typography>
                    <Typography variant="body1">
                      {selectedRequest.eventId?.location ||
                        "Location not specified"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={`/event-details/${selectedRequest.eventId?._id}`} 
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    Go to Event Page
                  </Button>
                </Box>
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Close
              </Button>

              {selectedRequest.status === "approved" &&
                selectedRequest.eventId &&
                selectedRequest.eventId._id && (
                  <Button
                    onClick={() => navigateToEventPage(selectedRequest.eventId)}
                    variant="contained"
                    sx={{
                      bgcolor: "#3f51b5",
                      "&:hover": { bgcolor: "#303f9f" },
                    }}
                    endIcon={<MdChevronRight />}
                  >
                    Go to Event Page
                  </Button>
                )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Events;
