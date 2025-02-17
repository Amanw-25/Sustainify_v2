import express from "express";
import { authenticate } from "../middlewares/verifyToken.js";
import { calculateCarbonFootprint ,chatWithMistralAI,getCarbonFootprint  } from "../controllers/CarbonFootPrint/carbonFootPrintController.js";


const carbonFootPrintRouter = express.Router();

carbonFootPrintRouter.post(
  "/calculate",
  authenticate,
  calculateCarbonFootprint
);

carbonFootPrintRouter.get(
  "/get",
  authenticate,
  getCarbonFootprint
);

carbonFootPrintRouter.post(
  "/chat",
  authenticate,
  chatWithMistralAI
);

export default carbonFootPrintRouter;
