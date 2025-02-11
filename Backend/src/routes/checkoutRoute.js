import express from 'express';
import { authenticate, restrict } from "../middlewares/verifyToken.js";
import { 
  getCheckoutSession, 
  verifyPayment,
  getUserOrders 
} from '../controllers/Product/CheckoutController.js';

const CheckoutRouter = express.Router();

// User must be logged in to access these routes
CheckoutRouter.use(authenticate);
CheckoutRouter.use(restrict('user'));

CheckoutRouter.post('/create-checkout-session', getCheckoutSession);
CheckoutRouter.get('/verify-payment', verifyPayment);
CheckoutRouter.get('/orders', getUserOrders);

export default CheckoutRouter;