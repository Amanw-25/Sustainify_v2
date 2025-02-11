import express from "express";
import { addToCart, removeFromCart, updateQuantity, getCart, clearCart } from "../controllers/Product/CartController.js";
import { authenticate } from "../middlewares/verifyToken.js";

const CartRouter = express.Router();

CartRouter.post("/add",authenticate, addToCart);
CartRouter.delete("/remove/:productId", authenticate, removeFromCart);
CartRouter.put("/update", authenticate, updateQuantity);
CartRouter.get("/get", authenticate, getCart);
CartRouter.delete("/clear", authenticate, clearCart);

export default CartRouter;
