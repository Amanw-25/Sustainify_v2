import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { HashLoader } from "react-spinners";
import Sidebar from "../Global/Sidebar.jsx";
import { BASE_URL } from "../../../../config.js";

const EventApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loadingRequestId, setLoadingRequestId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (token) getAllRequests();
  }, [token]);

  const getAllRequests = async () => {
    try {
      const response = await fetch(`${BASE_URL}/event/requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data.requests);
      } else {
        setError(data.message || "Failed to fetch requests");
      }
    } catch (err) {
      setError("Error fetching requests: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, approve) => {
    setLoadingRequestId(id);
    setLoadingAction("approve");
    try {
      const response = await fetch(`${BASE_URL}/event/approve/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approve }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        setError(data.message || "Failed to approve request");
      }
    } catch (err) {
      setError("Error approving request: " + err.message);
    } finally {
      setLoadingRequestId(null);
      setLoadingAction(null);
    }
  };

  const RejectApproval = async (id, approve) => {
    setLoadingRequestId(id);
    setLoadingAction("reject");
    try {
      const response = await fetch(`${BASE_URL}/event/reject/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approve }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else {
        setError(data.message || "Failed to reject request");
      }
    } catch (err) {
      setError("Error rejecting request: " + err.message);
    } finally {
      setLoadingRequestId(null);
      setLoadingAction(null);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      {isMobile && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            backgroundColor: "white",
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Box sx={{ width: "250px" }}>
          <Sidebar />
        </Box>
      )}

      <Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <Sidebar />
      </Drawer>

      <Box sx={{ flex: 1, p: 3, width: "100%" }}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight="bold"
          color="primary"
          sx={{ mb: 3, textAlign: isMobile ? "center" : "left" }}
        >
          Event Approval Requests
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : requests.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 5, color: "gray" }}>
            No approval requests found.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: 2,
              boxShadow: 3,
              overflowX: "auto",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Event Name", "Requested By", "Email", "Status", "Request ID", "Actions"].map(
                    (head) => (
                      <TableCell
                        key={head}
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#3B82F6",
                          zIndex: 2,
                          minWidth: isMobile ? "150px" : "auto",
                        }}
                      >
                        {head}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request._id} hover>
                    <TableCell>{request.eventId?.name || "N/A"}</TableCell>
                    <TableCell>{request.userId?.name || "N/A"}</TableCell>
                    <TableCell>{request.userId?.email || "N/A"}</TableCell>
                    <TableCell>
                      <Box sx={{
                        color: request.status === "pending" ? "#EAB308" : 
                               request.status === "approved" ? "#22C55E" : "#EF4444",
                        fontWeight: 500
                      }}>
                        {request.status}
                      </Box>
                    </TableCell>
                    <TableCell>{request._id}</TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: "flex", 
                        gap: 1,
                        flexDirection: isMobile ? "column" : "row"
                      }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApproval(request._id, true)}
                          disabled={loadingRequestId === request._id}
                          sx={{ minWidth: isMobile ? "100%" : "auto" }}
                        >
                          {loadingRequestId === request._id && loadingAction === "approve" ? (
                            <HashLoader color="white" size={20} />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => RejectApproval(request._id, false)}
                          disabled={loadingRequestId === request._id}
                          sx={{ minWidth: isMobile ? "100%" : "auto" }}
                        >
                          {loadingRequestId === request._id && loadingAction === "reject" ? (
                            <HashLoader color="white" size={20} />
                          ) : (
                            "Reject"
                          )}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default EventApproval;