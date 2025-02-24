import React, { useMemo } from "react";
import {
  Drawer,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  Button,
  Divider,
  Badge,
  Fab,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Cart = ({ 
  isOpen, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout,
  onClearCart,
  setIsCartOpen 
}) => {
  const theme = useTheme();
  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalItems = useMemo(() => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  }, [cart?.items]);

  const totalPrice = useMemo(() => {
    return cart?.items?.reduce((total, item) => 
      total + (item.product?.price * item.quantity), 0) || 0;
  }, [cart?.items]);

  const handleQuantityUpdate = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(productId, newQuantity);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={totalItems} color="error">
          <Fab
            color="primary"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCartIcon />
          </Fab>
        </Badge>
      </Box>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsCartOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: {
              xs: "100%",
              sm: 400,
            },
            padding: 2,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4">Shopping Cart</Typography>
            <IconButton onClick={() => setIsCartOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {(!cart?.items || cart.items.length === 0) ? (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "gray" }}
            >
              Your cart is empty
            </Typography>
          ) : (
            <>
              <List>
                {cart.items.map((item) => (
                  <ListItem key={item.product._id} sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.product?.images?.[0]?.url}
                        alt={item.product?.name}
                        variant="rounded"
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <Box sx={{ width: "100%", ml: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">{item.product?.name}</Typography>
                        <Typography variant="subtitle1">
                          {formatPrice(item.product?.price)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <IconButton
                          color="error"
                          onClick={() => onRemoveItem(item.product._id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h5">{formatPrice(totalPrice)}</Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onCheckout}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                    mb: 1
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  color="error"
                  onClick={onClearCart}
                >
                  Clear Cart
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Cart;