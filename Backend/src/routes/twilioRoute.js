import express from 'express';
import { sendOTP } from '../controllers/OTP/twilioController.js';
import { verifyOTP } from '../controllers/OTP/twilioController.js';

const twilioRouter = express.Router();

twilioRouter.post('/sendOTP', sendOTP);
twilioRouter.post('/verifyOTP', verifyOTP);

export default twilioRouter;