import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false); // Track favorite state

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
      sx={{
        maxWidth: 300, // Fixed width for the card
        margin: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
        borderRadius: '8px', // Rounded corners
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
        '&:hover': {
          transform: 'scale(1.05)', // Slightly scale up on hover
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Increase shadow on hover
        },
      }}
    >
      <CardMedia
        component="img"
        height="100" // Fixed height for the image
        image={product.image}
        alt={product.name}
        sx={{
          objectFit: 'cover', // Ensure the image covers the area without distortion
          borderTopLeftRadius: '8px', // Rounded corners for the image
          borderTopRightRadius: '8px',
        }}
      />
      <CardContent sx={{ padding: '16px' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: 'bold', color: '#004d40' }} // Dark green color for the title
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ minHeight: '40px' }} // Ensure consistent height for description
        >
          {product.description}
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: '#00796b'}} // Dark teal color for price
        >
          ${product.price}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: '8px' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: '#004d40', // Dark green background
              '&:hover': {
                backgroundColor: '#00796b', // Dark teal on hover
              },
            }}
          >
            Add to Cart
          </Button>

          <IconButton
            onClick={handleFavoriteToggle}
            sx={{ color: isFavorite ? 'red' : 'gray' }}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
