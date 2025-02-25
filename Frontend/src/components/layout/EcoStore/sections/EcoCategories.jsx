import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../../config.js";
import { Typography, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./ProductGrid.css";
import Loading from "../../../../Loader/Loading.jsx";

const EcoCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Use a single common sustainability image for all categories
  const commonImageUrl = "https://plus.unsplash.com/premium_photo-1677706393867-66c3b1396dbb?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          0: { slidesPerView: 3 },
          600: { slidesPerView: 5 },
          900: { slidesPerView: 8 },
          1200: { slidesPerView: 10 },
        }}
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <Box sx={{ textAlign: "center", p: 2, ml: 4 }}>
              <img
                src={commonImageUrl}
                alt={category}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  border: "2px solid #004d40",
                  objectFit: "cover",
                }}
              />
              <Typography variant="subtitle1" sx={{ mt: 1, ml: -4 }}>
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