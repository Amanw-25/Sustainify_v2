import React from 'react';
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
  Fab
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Cart = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout 
}) => {
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={getTotalItems()} color="error">
          <Fab
            color="primary"
            onClick={() => onClose(true)}
            sx={{ 
              bgcolor: '#004d40',
              '&:hover': {
                bgcolor: '#00695c'
              }
            }}
          >
            <ShoppingCartIcon />
          </Fab>
        </Badge>
      </Box>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => onClose(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: {
              xs: '100%',
              sm: 400,
            },
            padding: 2,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h3">Shopping Cart</Typography>
            <IconButton onClick={() => onClose(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {cart.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', color: 'gray' }}>
              Your cart is empty
            </Typography>
          ) : (
            <>
              <List>
                {cart.map((item) => (
                  <ListItem key={item._id} sx={{ mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar 
                        src={item.images?.[0]?.url}
                        alt={item.name}
                        variant="rounded"
                        sx={{ width: 60, height: 60, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <Box sx={{ width: '100%', ml: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h5">{item.name}</Typography>
                        <Typography variant="subtitle1">${item.price}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => onUpdateQuantity(item._id, -1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => onUpdateQuantity(item._id, 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <IconButton 
                          color="error" 
                          onClick={() => onRemoveItem(item._id)}
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h5">Total:</Typography>
                  <Typography variant="h4">${getTotalPrice().toFixed(2)}</Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={onCheckout}
                  sx={{
                    bgcolor: '#004d40',
                    '&:hover': {
                      bgcolor: '#00695c'
                    }
                  }}
                >
                  Proceed to Checkout
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