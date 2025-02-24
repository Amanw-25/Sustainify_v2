import mongoose from 'mongoose';

const blogReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  blogPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  createdAt: { type: Date, default: Date.now },
});

const BlogReview = mongoose.model('BlogReview', blogReviewSchema);
export default BlogReview;