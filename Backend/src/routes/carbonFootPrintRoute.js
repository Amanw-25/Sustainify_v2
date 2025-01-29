import express from "express";
import { authenticate } from "../middlewares/verifyToken.js";
import { calculateCarbonFootprint } from "../controllers/carbonFootPrintController.js";
import { chatWithMistralAI } from "../controllers/carbonFootPrintController.js";

const carbonFootPrintRouter = express.Router();

carbonFootPrintRouter.post(
  "/calculate",
  authenticate,
  calculateCarbonFootprint
);

carbonFootPrintRouter.post(
  "/chat",
  authenticate,
  chatWithMistralAI
);

export default carbonFootPrintRouter;
