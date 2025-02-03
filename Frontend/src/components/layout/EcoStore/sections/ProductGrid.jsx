import React from "react";
import { Typography, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { BASE_URL } from "../../../../config.js";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";
import Loading from "../../../../Loader/Loading.jsx";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.status === "Success") {
          setProducts(data.products);

          const uniqueCategories = [
            ...new Set(data.products.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ my: 4 }}>
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          textAlign: "center",
          fontWeight: "bold",
          color: "#004d40",
        }}
      >
        Featured Eco-Friendly Products
      </Typography>

      {categories.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: "center", 
            color: "gray" 
          }}
        >
          No products available
        </Typography>
      ) : (
        categories.map((category) => {
          const filteredProducts = products.filter(
            (product) => product.category === category
          );

          return (
            <Box key={category} sx={{ mb: 5 }}>
              <Typography
                variant="h4"
                sx={{ mb: 2, ml: 4, fontWeight: "bold", color: "#004d40" }}
              >
                {category} Products
              </Typography>
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                spaceBetween={10}
                slidesPerView={6}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  600: {
                    slidesPerView: 2,
                  },
                  900: {
                    slidesPerView: 4,
                  },
                  1200: {
                    slidesPerView: 5,
                  },
                }}
              >
                {filteredProducts.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
                {/* Custom Right Arrow */}
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
              </Swiper>
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default ProductGrid;