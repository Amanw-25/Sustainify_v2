import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Box } from '@mui/material';

const CarouselComponent = () => {
  const images = [
    "https://images.unsplash.com/photo-1624377638671-904e9428f79c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1624377638671-904e9428f79c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1624377638671-904e9428f79c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1624377638671-904e9428f79c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1624377638671-904e9428f79c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    
  ];

  return (
    <Box
      sx={{
        width: '100%', // Full width
        height: '40vh', // 40% of the viewport height
        overflow: 'hidden', // Ensure no overflow
      }}
    >
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
        {images.map((img, index) => (
          <div key={index} style={{ height: '40vh' }}> {/* Match the height of the Box */}
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              style={{
                width: '100%',
                height: '100%', // Fill the entire carousel slide
                objectFit: 'cover', // Ensure the image covers the entire area
              }}
            />
          </div>
        ))}
      </Carousel>
    </Box>
  );
};

export default CarouselComponent;