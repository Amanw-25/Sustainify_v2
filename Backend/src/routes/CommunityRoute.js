import express from 'express';
import { createPost, getPosts, likePost, addComment } from '../controllers/Community/CommunityController.js';

const CommunityRouter = express.Router();

CommunityRouter.post('/createpost', createPost);
CommunityRouter.get('/getallpost', getPosts);
CommunityRouter.post('/like', likePost);
CommunityRouter.post('/comment', addComment);

export default CommunityRouter;

