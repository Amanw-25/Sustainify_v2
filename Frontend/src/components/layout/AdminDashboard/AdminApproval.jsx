import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { BASE_URL } from "../../../config.js";
import { HashLoader } from "react-spinners";
import { DataGrid } from "@mui/x-data-grid";
import Paper from '@mui/material/Paper';

const AdminApproval = () => {
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
    { field: "eventName", headerName: "Event Name", width: 180 },
    { field: "requestedBy", headerName: "Requested By", width: 180 },
    {field:"email",headerName:"Email",width:180},
    { field: "status", headerName: "Status", width: 130 },
    { field: "requestId", headerName: "RequestId", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleApproval(params.row.id, true)}
            disabled={loadingRequestId === params.row.id}
          >
            {loadingRequestId === params.row.id && loadingAction === "approve" ? (
              <HashLoader color="black" size={20} />
            ) : (
              "Approve"
            )}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ml: 2 }}
            onClick={() => RejectApproval(params.row.id, false)}
            disabled={loadingRequestId === params.row.id}
          >
            {loadingRequestId === params.row.id && loadingAction === "reject" ? (
              <HashLoader color="black" size={20} />
            ) : (
              "Reject"
            )}
          </Button>
        </>
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Event Approval Requests</Typography>
      <Paper sx={{ height: 400, width: '100%', mt: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
};

export default AdminApproval;
