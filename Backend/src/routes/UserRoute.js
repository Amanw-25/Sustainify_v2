import express from "express";
import { authenticate } from "../middlewares/verifyToken.js";
import { getUserProfile } from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.get("/profile",authenticate, getUserProfile);

export default UserRouter;