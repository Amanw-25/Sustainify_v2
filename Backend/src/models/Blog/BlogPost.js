import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  kicker: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isMemberOnly: { type: Boolean, default: false },
  tags: [{ type: String }],
  readTime: { type: String },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;