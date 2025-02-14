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
  Tooltip,
  Button,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/checkout/getallorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, currentStatus) => {
    let newStatus = "";
    if (currentStatus === "processing") newStatus = "shipped";
    else if (currentStatus === "shipped") newStatus = "delivered";
    else return;

    try {
      const response = await fetch(`${BASE_URL}/checkout/update-order-status/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update order");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatText = (text, maxLength = 30) =>
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text || "N/A";

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
          Manage Orders
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 5, color: "gray" }}>
            No orders found.
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
              <TableHead sx={{ backgroundColor: "#3B82F6" }}>
                <TableRow>
                  {["Order ID", "Customer", "Items", "Total Amount", "Status", "Shipping Address", "Actions"].map(
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
                {orders.map(({ _id, user, orderItems, totalAmount, paymentStatus, orderStatus, shippingAddress }) => (
                  <TableRow key={_id} hover>
                    <TableCell>
                      <Tooltip title={_id}>
                        <span>{_id.slice(0, 8)}...</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`${user?.name} (${user?.email})`}>
                        <span>{formatText(user?.name)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={orderItems.map(({ product, quantity }) => `${product.name} (x${quantity})`).join(", ")}>
                        <span>{`${orderItems.length} item${orderItems.length > 1 ? "s" : ""}`}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>₹{totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Box sx={{ color: paymentStatus === "completed" ? "#22C55E" : "#EF4444", fontWeight: 500 }}>
                        Payment: {paymentStatus}
                      </Box>
                      <Box
                        sx={{
                          color: orderStatus === "processing" ? "#EAB308" : orderStatus === "shipped" ? "#22C55E" : "#10B981",
                          fontWeight: 500,
                        }}
                      >
                        Order: {orderStatus}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`${shippingAddress?.street}, ${shippingAddress?.city}, ${shippingAddress?.state} ${shippingAddress?.zipCode}, ${shippingAddress?.country}`}>
                        <span>{formatText(shippingAddress?.street)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {orderStatus !== "delivered" && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => updateOrderStatus(_id, orderStatus)}
                        >
                          {orderStatus === "processing" ? "Mark as Shipped" : "Mark as Delivered"}
                        </Button>
                      )}
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

export default ManageOrder;
