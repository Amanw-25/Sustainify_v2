import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";
import { ResponsiveBar } from "@nivo/bar";

const ProductStat = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchProductData();
    }
  }, [token]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/product/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + (product.stock || 0),
    0
  );
  const outOfStock = products.filter((product) => product.stock === 0).length;

  const categories = [...new Set(products.map((product) => product.category))];
  const totalCategories = categories.length;

  // Identify the most popular category
  const categoryCounts = categories.map((category) => ({
    category,
    count: products.filter((product) => product.category === category).length,
  }));
  const mostPopularCategory = categoryCounts.reduce(
    (max, current) => (current.count > max.count ? current : max),
    { category: "N/A", count: 0 }
  );

  // Colors for categories (using the specified colors)
  const colorPalette = ["#3B82F6", "#62BB82", "#6368F1", "#F09D1B", "#E7545C"];

  // Assign colors dynamically within the given palette
  const productCountByCategory = categories.map((category, index) => ({
    category,
    count: products.filter((product) => product.category === category).length,
    color: colorPalette[index % colorPalette.length], // Cycle through colors
  }));

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      <Sidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Product Statistics Overview
        </Typography>

        {/* Product Statistics Cards */}
        <Box sx={{ display: "flex", gap: 2, mt: 3, overflowX: "auto" }}>
          {[
            { title: "Total Products", count: totalProducts, color: "#3B82F6" },
            {
              title: "Total Categories",
              count: totalCategories,
              color: "#62BB82",
            },
            {
              title: "Total Stock Available",
              count: totalStock,
              color: "#6368F1",
            },
            {
              title: "Out of Stock Products",
              count: outOfStock,
              color: "#F09D1B",
            },
            {
              title: "Most Popular Category",
              count: mostPopularCategory.category,
              color: "#E7545C",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: stat.color,
                color: "#fff",
                minWidth: "200px",
                height: "100px",
                borderRadius: "12px",
              }}
            >
              <CardContent>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.count}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Product Distribution Chart */}
        <Box
          sx={{
            mt: 5,
            p: 3,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: 1,
            height: "70%",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Product Distribution by Category
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ResponsiveBar
              data={productCountByCategory}
              keys={["count"]}
              indexBy="category"
              margin={{ top: 50, right: 50, bottom: 100, left: 60 }} 
              padding={0.3}
              colors={({ data }) => data.color}
              borderRadius={5}
              axisBottom={{
                tickSize: 5,
                tickPadding: 10,
                tickRotation: 0, 
                legend: "Categories wise Count",
                legendPosition: "middle",
                legendOffset: 60,
                format: (value) => value,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Number of Products",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              theme={{
                axis: {
                  legend: {
                    text: { fontSize: 14, fontWeight: "bold" },
                  },
                  ticks: {
                    text: { fontSize: 12, fontWeight: "bold" },
                  },
                },
              }}
              labelSkipWidth={8}
              labelSkipHeight={8}
              labelTextColor="#ffffff"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProductStat;
