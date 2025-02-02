import React, { useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import Banner from "./Banner";
import Categories from "./Categories";
import PostArticleButton from "./PostButton";
import BlogCard from "./BlogCard";
const Blog = () => {
  // Dummy blog data
  const blogs = [
    {
      title: "The Future of Sustainability in Tech",
      subtitle: "Innovative Solutions for a Greener Tomorrow",
      author: "John Doe",
      publishedDate: "2025-01-27",
      readTime: "5 min read",
      tags: ["Sustainability", "Technology", "Innovation"],
      image:
        "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0hbbA5oYhu17VDnUc7Ff-g.gif",
    },
    {
      title: "Green Energy: The Key to a Sustainable Future",
      subtitle: "Exploring Renewable Energy Solutions",
      author: "Jane Smith",
      publishedDate: "2025-01-15",
      readTime: "6 min read",
      tags: ["Green Energy", "Renewable", "Sustainability"],
      image:
        "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0hbbA5oYhu17VDnUc7Ff-g.gif",
    },
    {
      title: "Recycling and Its Impact on the Planet",
      subtitle: "How Recycling is Changing Our World",
      author: "Mark Johnson",
      publishedDate: "2025-02-02",
      readTime: "4 min read",
      tags: ["Recycling", "Sustainability", "Environment"],
      image:
        "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0hbbA5oYhu17VDnUc7Ff-g.gif",
    },
  ];

  const categories = [
    "Sustainability",
    "Technology",
    "Renewable",
    "Recycling",
    "Innovation",
    "Environment",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const blogsPerPage = 6;
  const totalBlogs = blogs.length;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);
  const displayedBlogs = selectedCategory
    ? blogs.filter((blog) => blog.tags.includes(selectedCategory))
    : blogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <Box style={{ backgroundColor: "#f7fafc", padding: "0" }}>
      <Banner />
      <Box
        style={{
          maxWidth: "1600px",
          margin: "40px auto",
          padding: "0 24px",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Categories
            categories={categories}
            handleCategoryClick={handleCategoryClick}
          />
          <PostArticleButton />
        </Box>

        <Grid container spacing={3} justifyContent="flex-start">
          {displayedBlogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <BlogCard blog={blog} index={index} />
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" style={{ marginTop: "32px" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Blog;