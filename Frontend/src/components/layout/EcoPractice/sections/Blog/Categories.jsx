import React, { useRef, useState } from "react";
import { Chip, Box, IconButton, useMediaQuery } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const Categories = ({ categories, handleCategoryClick }) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleScroll = (direction) => {
    if (isMobile) {
      setCurrentIndex((prev) => {
        if (direction === "left") return Math.max(prev - 1, 0);
        return Math.min(prev + 1, categories.length - 1);
      });
    } else {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box display="flex" alignItems="center" overflow="hidden">
      <IconButton onClick={() => handleScroll("left")} size="small">
        <ChevronLeft />
      </IconButton>

      <Box
        ref={scrollRef}
        display="flex"
        flexWrap="nowrap"
        overflow="hidden"
        sx={{
          width: isMobile ? "110px" : "auto",
          whiteSpace: "nowrap",
          transition: "all 0.3s ease",
        }}
      >
        {isMobile ? (
          <Chip
            label={categories[currentIndex]}
            clickable
            onClick={() => handleCategoryClick(categories[currentIndex])}
            sx={{ marginRight: "8px", backgroundColor: "#e5e7eb", color: "#374151" }}
          />
        ) : (
          categories.map((category, idx) => (
            <Chip
              key={idx}
              label={category}
              clickable
              onClick={() => handleCategoryClick(category)}
              sx={{ marginRight: "8px", backgroundColor: "#e5e7eb", color: "#374151" }}
            />
          ))
        )}
      </Box>

      <IconButton onClick={() => handleScroll("right")} size="small">
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default Categories;
