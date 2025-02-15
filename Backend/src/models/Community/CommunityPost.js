import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  retweets: [{
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;