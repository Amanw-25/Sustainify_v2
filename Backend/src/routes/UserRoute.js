import express from "express";
import { authenticate } from "../middlewares/verifyToken.js";
import { getUserProfile ,getAllUsers ,updateUserProfile} from "../controllers/userController.js";

const UserRouter = express.Router();

UserRouter.get("/profile",authenticate, getUserProfile);
UserRouter.put("/update",authenticate, updateUserProfile);
UserRouter.get("/all",authenticate, getAllUsers);

export default UserRouter;