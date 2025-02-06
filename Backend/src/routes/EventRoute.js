import express from 'express';
import { addEvent, getAllEvents, updateEvent, getEventById, deleteEvent } from '../controllers/Event/EventController.js';
import { requestToJoinEvent, approveRequest, getRequests ,rejectRequest } from "../controllers/Event/EventRequestController.js";
import { addEventRating, updateEventRating, getEventRating } from '../controllers/Event/EventRating.js';
import upload from "../middlewares/upload.js";
import { authenticate, restrict } from '../middlewares/verifyToken.js';

const EventRoute = express.Router();

EventRoute.post('/addEvent', upload.array("image"),authenticate, addEvent);
EventRoute.get('/getAllEvents', getAllEvents);
EventRoute.get('/getEventById/:id', getEventById);
EventRoute.put('/updateEvent/:id', upload.array("image"), authenticate, updateEvent);
EventRoute.delete('/deleteEvent/:id', authenticate, deleteEvent);

EventRoute.post('/addEventRating/:eventId', authenticate, addEventRating);
EventRoute.get('/getEventRating/:eventId', getEventRating);
EventRoute.put('/updateEventRating/:eventId', authenticate, updateEventRating);

EventRoute.post("/request/:eventId", authenticate, requestToJoinEvent);
EventRoute.put("/approve/:requestId", authenticate, restrict('admin'), approveRequest);
EventRoute.put("/reject/:requestId", authenticate, restrict('admin'), rejectRequest);
EventRoute.get("/requests", authenticate, restrict('admin'), getRequests);

export default EventRoute;