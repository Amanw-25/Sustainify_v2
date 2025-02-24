import mongoose from "mongoose";

const savedBlogSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    savedAt: { type: Date, default: Date.now },
});

const SavedBlog = mongoose.model("SavedBlog", savedBlogSchema);
export default SavedBlog;