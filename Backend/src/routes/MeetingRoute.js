import express from 'express';
import { createMeeting, joinMeeting, startMeeting, endMeeting, getMeetingDetails } from '../controllers/Meeting/MeetingController.js';

const MeetingRouter = express.Router();

MeetingRouter.post('/create', createMeeting);
MeetingRouter.post('/join', joinMeeting);
MeetingRouter.post('/start/:meetingId', startMeeting);
MeetingRouter.post('/end/:meetingId', endMeeting);
MeetingRouter.get('/details/:meetingId', getMeetingDetails);


export default MeetingRouter;
