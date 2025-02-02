import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/Product/ProductController.js";
import {
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getProductReviews
} from "../controllers/Product/ProductreviewController.js";
import { authenticate } from "../middlewares/verifyToken.js";
import upload from "../middlewares/upload.js";

const productRouter = express.Router();

// Routes for products
productRouter.post(
  "/create",
  upload.array("images", 5),
  authenticate,
  addProduct
);
productRouter.put(
  "/update/:id",
  upload.array("images", 5),
  authenticate,
  updateProduct
);
productRouter.delete("/delete/:id", authenticate, deleteProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// Routes for product reviews
productRouter.post("/review/:productId", authenticate, addProductReview);
productRouter.put("/review/:reviewId", authenticate, updateProductReview);
productRouter.delete("/review/:reviewId", authenticate, deleteProductReview);
productRouter.get("/review/:productId", getProductReviews);

export default productRouter;
