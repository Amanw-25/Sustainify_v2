
import express from 'express';
import {
  createSubscriptionSession,
  verifySubscription,
  getUserSubscription,
  cancelSubscription
} from '../controllers/Blog/SubscriptionController.js';
import { authenticate } from '../middlewares/verifyToken.js';

const SubscriptionRouter = express.Router();

SubscriptionRouter.use(authenticate);
SubscriptionRouter.post('/create-session', createSubscriptionSession);
SubscriptionRouter.get('/verify', verifySubscription);
SubscriptionRouter.get('/get-subscription', getUserSubscription);
SubscriptionRouter.delete('/cancel-subscription', cancelSubscription);

export default SubscriptionRouter;