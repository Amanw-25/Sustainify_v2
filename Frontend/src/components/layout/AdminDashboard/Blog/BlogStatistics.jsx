import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../Global/Sidebar";
import { BASE_URL } from "../../../../config.js";
import { ResponsiveBar } from "@nivo/bar";

const BlogStatistics = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  const isMobile = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (token) {
      fetchBlogData();
      fetchUserData();
    }
  }, [token]);

  const fetchBlogData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/blog/getBlogPosts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch blogs");

      setBlogs(data.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch users");

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const totalBlogs = blogs.length;
  const uniqueTags = new Set(blogs.flatMap((blog) => blog.tags || []));
  const totalCategories = uniqueTags.size;

  const uniqueAuthors = new Set(
    blogs
      .filter((blog) => blog.author && blog.author._id)
      .map((blog) => blog.author._id)
  ).size;

  const totalMembers = users.filter((user) => user.isMember).length;
  const totalMonthlyMembers = users.filter(
    (user) => user.isMember && user.membershipType === "monthly"
  ).length;
  const totalYearlyMembers = users.filter(
    (user) => user.isMember && user.membershipType === "yearly"
  ).length;

  const tagCounts = blogs
    .flatMap((blog) => blog.tags || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const mostPopularCategory = Object.entries(tagCounts).reduce(
    (max, [tag, count]) => (count > max.count ? { category: tag, count } : max),
    { category: "N/A", count: 0 }
  );

  const colorPalette = ["#3B82F6", "#62BB82", "#6368F1", "#F09D1B", "#E7545C"];

  const blogCountByCategory = Object.keys(tagCounts).map((tag, index) => ({
    category: tag,
    count: tagCounts[tag],
    color: colorPalette[index % colorPalette.length],
  }));

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f4f6f9" }}>
      {isMobile && (
        <IconButton
          onClick={() => setSidebarOpen(true)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            backgroundColor: "white",
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && (
        <Box sx={{ width: "250px" }}>
          <Sidebar />
        </Box>
      )}

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Sidebar />
      </Drawer>

      <Box sx={{ flex: 1, p: 3, width: "100%" }}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight="bold"
          color="primary"
          sx={{ mb: 2, textAlign: isMobile ? "center" : "left" }}
        >
          Blog Statistics Overview
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 3,
            overflowX: "auto",
            flexWrap: isMobile ? "nowrap" : "wrap",
            pb: 2,
          }}
        >
          {[
            { title: "Total Blogs", count: totalBlogs, color: "#3B82F6" },
            {
              title: "Total Categories",
              count: totalCategories,
              color: "#62BB82",
            },
            { title: "Unique Authors", count: uniqueAuthors, color: "#6368F1" },
            { title: "Total Members", count: totalMembers, color: "#F09D1B" },
            {
              title: "Monthly Members",
              count: totalMonthlyMembers,
              color: "#FF9800",
            },
            {
              title: "Yearly Members",
              count: totalYearlyMembers,
              color: "#4CAF50",
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
                flexShrink: 0,
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

        <Box
          sx={{
            mt: 5,
            p: 3,
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: 1,
            height: isMobile ? "450px" : "70%",
            width: "100%",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Blog Distribution by Category
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ResponsiveBar
              data={blogCountByCategory}
              keys={["count"]}
              indexBy="category"
              margin={{
                top: 30,
                right: isMobile ? 10 : 50,
                bottom: isMobile ? 50 : 100,
                left: isMobile ? 40 : 60,
              }}
              padding={0.3}
              colors={({ data }) => data.color}
              borderRadius={5}
              axisBottom={{
                tickSize: 5,
                tickPadding: 10,
                tickRotation: isMobile ? -30 : 0,
                legend: "Categories wise Count",
                legendPosition: "middle",
                legendOffset: isMobile ? 20 : 60,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                legend: "Number of Blogs",
                legendPosition: "middle",
                legendOffset: -50,
              }}
              theme={{
                axis: {
                  legend: { text: { fontSize: 14, fontWeight: "bold" } },
                  ticks: { text: { fontSize: 12, fontWeight: "bold" } },
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

export default BlogStatistics;
