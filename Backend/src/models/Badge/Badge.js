import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  earnedDate: { type: Date, default: Date.now },
});

const Badge = mongoose.model("Badge", badgeSchema);

export default Badge;
