import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";
import { useCart } from '../../../../../hooks/useCart'

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart(); 

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/eco-store/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); 
    const success = await addToCart(product);

    if (success) {
      toast.success("Product added to cart");
    } else {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 300,
        margin: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height="100"
        image={product.images?.[0]?.url || "fallback-image-url"}
        alt={product.name}
        sx={{
          objectFit: "cover",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      />

      <CardContent sx={{ padding: "16px" }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", color: "#004d40" }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ minHeight: "40px" }}
        >
          {product.shortdescription}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00796b" }}>
          &#8377;{product.price}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "8px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddToCart}
            sx={{
              backgroundColor: "#004d40",
              "&:hover": {
                backgroundColor: "#00796b",
              },
            }}
          >
            Add to Cart
          </Button>

          <IconButton
            onClick={handleFavoriteToggle}
            sx={{
              color: isFavorite ? "red" : "gray",
            }}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
