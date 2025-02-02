import React from "react";
import { Chip, Box } from "@mui/material";

const Categories = ({ categories, handleCategoryClick }) => {
  return (
    <Box display="flex" flexWrap="wrap" style={{ marginBottom: "32px" }}>
      {categories.map((category, idx) => (
        <Chip
          key={idx}
          label={category}
          clickable
          onClick={() => handleCategoryClick(category)}
          style={{
            marginRight: "8px",
            marginBottom: "8px",
            backgroundColor: "#e5e7eb",
            color: "#374151",
            fontSize: "12px",
          }}
        />
      ))}
    </Box>
  );
};

export default Categories;