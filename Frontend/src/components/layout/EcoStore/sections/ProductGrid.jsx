import React from 'react';
import { Typography, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const products = [
  // Eco-Friendly Lamp Category
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting', // Category
  },
  // Organic Cotton T-Shirt Category
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel', // Category
  },
  // Solar-Powered Charger Category
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy', // Category
  },
  // Compostable Food Containers Category
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen', // Category
  },
  // Duplicate products for the sake of multiple rows
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting',
  },
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel',
  },
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy',
  },
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen',
  },
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting', // Category
  },
  // Organic Cotton T-Shirt Category
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel', // Category
  },
  // Solar-Powered Charger Category
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy', // Category
  },
  // Compostable Food Containers Category
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen', // Category
  },
  // Duplicate products for the sake of multiple rows
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting',
  },
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel',
  },
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy',
  },
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen',
  },
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting', // Category
  },
  // Organic Cotton T-Shirt Category
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel', // Category
  },
  // Solar-Powered Charger Category
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy', // Category
  },
  // Compostable Food Containers Category
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen', // Category
  },
  // Duplicate products for the sake of multiple rows
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting',
  },
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel',
  },
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy',
  },
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen',
  },
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting', // Category
  },
  // Organic Cotton T-Shirt Category
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel', // Category
  },
  // Solar-Powered Charger Category
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy', // Category
  },
  // Compostable Food Containers Category
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen', // Category
  },
  // Duplicate products for the sake of multiple rows
  {
    id: 1,
    name: 'Eco-Friendly Lamp',
    description: 'Energy-efficient lighting solution.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Lighting',
  },
  {
    id: 2,
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Apparel',
  },
  {
    id: 5,
    name: 'Solar-Powered Charger',
    description: 'Harness the power of the sun.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Energy',
  },
  {
    id: 6,
    name: 'Compostable Food Containers',
    description: 'Eco-friendly and biodegradable.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80',
    category: 'Kitchen',
  },
];

const categories = ['Lighting', 'Apparel', 'Energy', 'Kitchen'];

const ProductGrid = () => {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h3" sx={{ mb: 3,textAlign: 'center', fontWeight: 'bold', color: '#004d40' }}>
        Featured Eco-Friendly Products
      </Typography>

      {/* Loop through categories */}
      {categories.map((category) => {
        const filteredProducts = products.filter(product => product.category === category);

        return (
          <Box key={category} sx={{ mb: 5 }}>
            <Typography variant="h3" sx={{ mb: 2, ml : 4,fontWeight: 'bold', color: '#004d40' }}>
              {category} Products
            </Typography>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
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
                <SwiperSlide key={product.id}>
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
