import express from "express";
import { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getAllProducts, 
  getProductById 
} from "../controllers/Product/ProductController.js";
import { authenticate } from "../middlewares/verifyToken.js";

const productRouter = express.Router();

// Routes for products
productRouter.post("/create", authenticate, addProduct);
productRouter.put("/update/:id", authenticate, updateProduct);
productRouter.delete("/delete/:id", authenticate, deleteProduct);
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

export default productRouter;
