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

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
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
          setProducts(data.products);

          // Extract unique categories from products
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

      {/* Loop through categories */}
      {categories.map((category) => {
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
      })}
    </Box>
  );
};

export default ProductGrid;