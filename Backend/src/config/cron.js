import cron from 'node-cron';
import { assignBadgesAutomatically } from '../utils/badgeService.js';

cron.schedule('55 23 * * *', async () => {
  console.log('Running badge assignment...');
  await assignBadgesAutomatically();
  console.log("Badge assignment complete");  
});
