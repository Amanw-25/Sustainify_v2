import express from "express";
import { authenticate, restrict } from "../middlewares/verifyToken.js";
import { getCheckoutSession, handleStripeWebhook } from "../controllers/Product/CheckoutController.js";

const CheckoutRouter = express.Router();
CheckoutRouter.post("/create-session", authenticate, restrict("user"), getCheckoutSession);

CheckoutRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }), 
  handleStripeWebhook
);


export default CheckoutRouter;