import express from "express";
import {
  createBlogPost,
  getBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/Blog/BlogController.js";
import {
  createBlogReview,
  getBlogReviews,
  updateBlogReview,
} from "../controllers/Blog/BlogReviewController.js";
import { saveBlog,getSavedBlog,deleteSavedBlog } from "../controllers/Blog/SavedBlogController.js";
import { authenticate } from "../middlewares/verifyToken.js";
import upload from "../middlewares/upload.js";

const BlogRouter = express.Router();


// Blog
BlogRouter.post(
  "/createBlogPost",
  upload.array("previewImage"),
  authenticate,
  createBlogPost
);
BlogRouter.get("/getBlogPosts", getBlogPosts);
BlogRouter.get("/getSingleBlogPost/:id", getSingleBlogPost);
BlogRouter.put(
  "/updateBlogPost/:id",
  upload.array("previewImage"),
  authenticate,
  updateBlogPost
);
BlogRouter.delete("/deleteBlogPost/:id", authenticate, deleteBlogPost);


// Blog Reviews
BlogRouter.post("/createBlogReview/:id", authenticate, createBlogReview);
BlogRouter.get("/getBlogReviews/:blogPostId", getBlogReviews);
BlogRouter.put("/updateBlogReview/:reviewId", authenticate, updateBlogReview);


// Saved Blog
BlogRouter.post("/saveBlog", authenticate, saveBlog);
BlogRouter.get("/getSavedBlog", authenticate, getSavedBlog);
BlogRouter.delete("/deleteSavedBlog/:id", authenticate, deleteSavedBlog);

export default BlogRouter;
