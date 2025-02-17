import React, { useState, useEffect } from "react";
import Error from "../../../../Error/Error.jsx";
import Loading from "../../../../Loader/Loading";
import { BASE_URL } from "../../../../config.js";
import { 
  Pagination,
  Stack,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Grid
} from '@mui/material';

const ProductOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${BASE_URL}/checkout/user/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch orders.");
        }

        // Sort orders by date (newest first)
        const sortedOrders = data.orders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
        setTotalOrders(sortedOrders.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Get current order based on pagination
  const getCurrentOrder = () => {
    return orders[page - 1];
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error errorMessage={error} />;
  if (!orders.length) return (
    <Typography variant="h6" align="center">No orders found</Typography>
  );

  const currentOrder = getCurrentOrder();
  return (
    <Box>
      {currentOrder && (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          {/* Order Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold' }}>
              Order ID: {currentOrder._id}
            </Typography>
            <Chip 
              label={currentOrder.orderStatus}
              color={getStatusColor(currentOrder.orderStatus)}
              variant="outlined"
            />
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Ordered on: {new Date(currentOrder.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" align="right">
                Payment Status: {currentOrder.paymentStatus}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Order Items */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 ,fontWeight:"bold" }}>Order Items:</Typography>
            {currentOrder.orderItems.map((item) => (
              <Paper 
                key={item._id} 
                variant="outlined" 
                sx={{ p: 2, mb: 2 }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={2}>
                    <img
                      src={item.product.images[0].url || '/default-product-image.png'}
                      alt={item.productName}
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        maxWidth: '80px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{fontWeight:"bold"}}>{item.productName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product.shortdescription}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">Quantity: {item.quantity}</Typography>
                      <Typography variant="subtitle2">₹{item.price}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Order Summary */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total Amount: ₹{currentOrder.totalAmount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shipping Address: {currentOrder.shippingAddress.street}, 
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - 
              {currentOrder.shippingAddress.zipCode}, {currentOrder.shippingAddress.country}
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Stack spacing={2}>
          <Pagination
            count={totalOrders}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="large"
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default ProductOrders;