import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  kicker: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  previewImage: { type: String ,default:'https://sb.ecobnb.net/app/uploads/sites/3/2023/05/Green-Blogging-How-to-Start-a-Sustainable-Living-Blog-1-1170x490.jpg'},
  isMemberOnly: { type: Boolean, default: false },
  tags: [{ type: String }],
  readTime: { type: String },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;