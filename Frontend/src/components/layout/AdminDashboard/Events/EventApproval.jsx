import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { BASE_URL } from "../../../../config.js";
import { HashLoader } from "react-spinners";
import { DataGrid } from "@mui/x-data-grid";
import Sidebar from "../Global/Sidebar.jsx";

const EventApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loadingRequestId, setLoadingRequestId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
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
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    getAllRequests();
  }, [token]);

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
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Error approving request:", err);
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
        console.error("Error:", data.message);
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
    } finally {
      setLoadingRequestId(null);
      setLoadingAction(null);
    }
  };

  const columns = [
    { field: "eventName", headerName: "Event Name", width: 200 },
    { field: "requestedBy", headerName: "Requested By", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "requestId", headerName: "Request ID", width: 220 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          margin= "10px"
          alignItems="center"
          width="100%"
          gap={2}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ padding: "5px 10px", minWidth: "90px" }} 
            onClick={() => handleApproval(params.row.id, true)}
            disabled={loadingRequestId === params.row.id}
          >
            {loadingRequestId === params.row.id && loadingAction === "approve" ? (
              <HashLoader color="white" size={20} />
            ) : (
              "Approve"
            )}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ padding: "5px 10px", minWidth: "90px" }}
            onClick={() => RejectApproval(params.row.id, false)}
            disabled={loadingRequestId === params.row.id}
          >
            {loadingRequestId === params.row.id && loadingAction === "reject" ? (
              <HashLoader color="white" size={20} />
            ) : (
              "Reject"
            )}
          </Button>
        </Box>
      ),
    },
  ];
  

  const rows = requests.map((request) => ({
    id: request._id,
    eventName: request.eventId?.name,
    requestedBy: request.userId?.name,
    email: request.userId?.email,
    status: request.status,
    requestId: request._id,
  }));

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, padding: "20px", overflow: "auto" }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "15px 20px",
            borderRadius: "8px",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Event Approval Requests
          </Typography>
        </Box>

        <Paper sx={{ height: '80%', width: "100%", padding: "20px" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            padding="10px"
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default EventApproval;
