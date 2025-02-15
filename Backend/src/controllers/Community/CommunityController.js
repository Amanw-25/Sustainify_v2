import {Post} from '../../models/index.js';

export const createPost = async (req, res) => {
  console.log("Authenticated User:", req.user);  // Debugging line

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const { content, image } = req.body;
    const userId = req.userId;

    const post = await Post.create({
      userId,
      content,
      image
    });

    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'name avatar handle');

    req.io.emit('newPost', populatedPost);
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'name avatar handle')
      .populate('likes', 'name')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).populate('likes', 'name');

    req.io.emit('postLiked', { postId, likes: post.likes });
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user._id;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { userId, content } } },
      { new: true }
    ).populate('comments.userId', 'name avatar');

    req.io.emit('newComment', { postId, comments: post.comments });
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};