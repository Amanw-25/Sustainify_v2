import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Sidebar from "../../layout/AdminDashboard/Global/Sidebar.jsx";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, padding: "20px", overflow: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: "15px 20px",
            borderRadius: "8px",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Welcome to Admin Dashboard
          </Typography>
          <IconButton onClick={handleLogout} color="error">
            <LogoutIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <Box className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h6" fontWeight="bold" color="primary">
              Total Users
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              className="text-gray-800"
            >
              1,250
            </Typography>
          </Box>

          <Box className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h6" fontWeight="bold" color="secondary">
              Sales Revenue
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              className="text-gray-800"
            >
              $32,000
            </Typography>
          </Box>

          <Box className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h6" fontWeight="bold" color="success">
              Pending Orders
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              className="text-gray-800"
            >
              87
            </Typography>
          </Box>

          <Box className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h6" fontWeight="bold" color="error">
              Complaints
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              className="text-gray-800"
            >
              12
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
