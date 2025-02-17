import express from 'express';
import { assignBadgesAutomatically } from '../utils/badgeService.js';

const router = express.Router();

// Test route to manually trigger badge assignment
router.get('/test-badges', async (req, res) => {
  try {
    await assignBadgesAutomatically();
    res.status(200).json({ message: 'Badges assigned successfully!' });
  } catch (err) {
    console.error('Error assigning badges:', err);
    res.status(500).json({ error: 'Error assigning badges' });
  }
});

export default router;
