import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("eventRequests")) || [];
    setRequests(storedRequests);
  }, []);

  const handleApprove = (id) => {
    let updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: "Approved" } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("eventRequests", JSON.stringify(updatedRequests));

    // Simulate sending an email (later replaced with backend email integration)
    alert(`✅ ${updatedRequests.find((req) => req.id === id).name} has been approved and notified!`);
  };

  const handleReject = (id) => {
    let updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: "Rejected" } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem("eventRequests", JSON.stringify(updatedRequests));
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: "24px" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        🔑 Admin Dashboard
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Event</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id}>
              <TableCell>{req.name}</TableCell>
              <TableCell>{req.email}</TableCell>
              <TableCell>{req.eventTitle}</TableCell>
              <TableCell>{req.status}</TableCell>
              <TableCell>
                {req.status === "Pending" && (
                  <>
                    <Button onClick={() => handleApprove(req.id)} color="success">Approve</Button>
                    <Button onClick={() => handleReject(req.id)} color="error">Reject</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminDashboard;
