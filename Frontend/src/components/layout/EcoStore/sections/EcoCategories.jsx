import React from "react";
import { BASE_URL } from "../../../../config.js";
import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./ProductGrid.css";

const EcoCategories = () => {

  const [categories, setCategories] = useState([]);

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
          const uniqueCategories = [
            ...new Set(data.products.map((product) => product.category)),
          ];
          console.log(uniqueCategories);
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Box sx={{ textAlign: "center", my: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: "bold", color: "#004d40" }}
      >
        Explore Eco-Friendly Categories
      </Typography>

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={10}
        slidesPerView={3}
        breakpoints={{
          0: {
            slidesPerView: 3,
          },
          600: {
            slidesPerView: 5,
          },
          900: {
            slidesPerView: 8,
          },
          1200: {
            slidesPerView: 10, // Show 10 categories on extra large screens
          },
        }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ textAlign: "center", p: 2, ml: 4 }}>
              <img
                src="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                alt={category.name}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  border: "2px solid #004d40",
                  objectFit: "cover",
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ mt: 1, ml: -4, fontWeight: "small" }}
              >
                {category}
              </Typography>
            </Box>
          </SwiperSlide>
        ))}

        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </Swiper>
    </Box>
  );
};

export default EcoCategories;
