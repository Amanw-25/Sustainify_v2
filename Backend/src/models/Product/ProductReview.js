import mongoose from "mongoose";
import Product from "./ProductSchema.js";

const productReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

productReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name photo",
  });

  next();
});

productReviewSchema.statics.calcAverageRatings = async function (productId) {
  //THIS POINTS TO THE CURRENT REVIEW
  const stats = await this.aggregate([
    {
      $match: { productId: productId },
    },
    {
      $group: {
        _id: "$productId",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        reviews: { $push: "$comment" },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    totalRating: stats[0].numOfRating,
    averageRating: stats[0].avgRating,
    reviews: stats[0].reviews,
  });
};

productReviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.productId);
});

const ProductReview = mongoose.model("ProductReview", productReviewSchema);
export default ProductReview;
