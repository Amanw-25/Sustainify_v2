import express from "express";
import {
  createBlogPost,
  getBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../controllers/Blog/BlogController.js";
import { authenticate } from "../middlewares/verifyToken.js";

const BlogRouter = express.Router();

BlogRouter.post("/createBlogPost", authenticate, createBlogPost);
BlogRouter.get("/getBlogPosts", getBlogPosts);
BlogRouter.get("/getSingleBlogPost/:id", getSingleBlogPost);
BlogRouter.put("/updateBlogPost/:id", authenticate, updateBlogPost);
BlogRouter.delete("/deleteBlogPost/:id", authenticate, deleteBlogPost);

export default BlogRouter;
