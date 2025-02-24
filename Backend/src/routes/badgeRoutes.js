import express from 'express';
import { getUserBadges ,getBadgeById} from '../controllers/BadgeController/badgeController.js';
import { authenticate } from '../middlewares/verifyToken.js';

const BadgeRouter = express.Router();

BadgeRouter.get('/badges',authenticate, getUserBadges);
BadgeRouter.get('/badges/:badgeId', getBadgeById);

export default BadgeRouter ;
