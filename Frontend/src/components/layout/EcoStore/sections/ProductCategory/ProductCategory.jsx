import React from 'react';
import { Typography, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "../ProductCard/ProductCard";

const ProductCategory = ({ category, products, onAddToCart }) => {
  const filteredProducts = products.filter(product => product.category === category);

  return (
    <Box sx={{ mb: 5 }}>
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
          prevEl: ".swiper-button-prev"
        }}
        spaceBetween={10}
        slidesPerView={6}
        breakpoints={{
          0: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          900: { slidesPerView: 4 },
          1200: { slidesPerView: 5 },
        }}
      >
        {filteredProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard
              product={product}
              onAddToCart={() => onAddToCart(product)}
            />
          </SwiperSlide>
        ))}
        <div className="swiper-button-next" />
        <div className="swiper-button-prev" />
      </Swiper>
    </Box>
  );
};

export default ProductCategory;