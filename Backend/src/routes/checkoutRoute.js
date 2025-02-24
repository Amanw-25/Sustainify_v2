import express from 'express';
import { authenticate, restrict } from "../middlewares/verifyToken.js";
import { 
  getCheckoutSession, 
  verifyPayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/Product/CheckoutController.js';

const CheckoutRouter = express.Router();

// User must be logged in to access these routes
CheckoutRouter.use(authenticate);

CheckoutRouter.post('/create-checkout-session', getCheckoutSession);
CheckoutRouter.get('/verify-payment', verifyPayment);
CheckoutRouter.get('/user/orders', getUserOrders);
CheckoutRouter.get('/getallorders', getAllOrders);
CheckoutRouter.put('/update-order-status/:id',updateOrderStatus);

export default CheckoutRouter;