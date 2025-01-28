import mongoose from "mongoose";

const userBlogsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  publishedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }], 
  likedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }], 
  savedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }], 
  blogComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogReview" }], 
  subscription: {
    isSubscribed: { type: Boolean, default: false },
    subscriptionId: { type: String, default: "" },
  },
});

const UserBlogs = mongoose.model("UserBlogs", userBlogsSchema);
export default UserBlogs;
