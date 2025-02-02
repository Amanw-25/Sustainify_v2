import React, { useEffect, useState } from "react";
import { Grid, Box, Pagination } from "@mui/material";
import Banner from "./Banner";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../../config.js";
import Categories from "./Categories";
import PostArticleButton from "./PostButton";
import BlogCard from "./BlogCard";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const blogsPerPage = 6;
  const totalBlogs = blogs.length;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  // Filter blogs based on category and pagination
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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/blog/getBlogPosts`);
        const data = await response.json();
        if (data.success) {
          setBlogs(data.data);
          const uniqueCategories = [
            ...new Set(data.data.map((blog) => blog.tags).flat()),
          ];
          setCategories(uniqueCategories);
        } else {
          toast.error(data.message);
          console.log(data.error);
        }
      } catch (err) {
        toast.error("Error fetching blogs");
        console.log(err);
      }
    };
    fetchBlogs();
  }, []);

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
            <Grid item xs={12} sm={6} md={4} key={blog._id}> {/* Use unique id for key */}
              <BlogCard blog={blog} index={index} /> {/* Pass single blog and index */}
            </Grid>
          ))}
        </Grid>

        <Box
          display="flex"
          justifyContent="center"
          style={{ marginTop: "32px" }}
        >
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
