import { ProductReview } from "../../models/index.js";

export const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await ProductReview.find({ productId }).populate("userId");

    if(reviews.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No reviews found for this product",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error fetching reviews",
      error: error.message,
    });
  }
}

export const addProductReview = async (req, res) => {
  const userId = req.userId;
  const { comment, rating } = req.body;
  const { productId } = req.params;

  try {
    const review = await ProductReview.create({
      userId,
      productId,
      comment,
      rating,
    });

    res.status(201).json({
      status: "Success",
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error adding review",
      error: error.message,
    });
  }
};

export const updateProductReview = async (req, res) => {
  const { reviewId } = req.params;
  const { comment, rating } = req.body;
  const userId = req.userId;
  console.log("userId", userId);
  console.log("reviewId", reviewId);

  try {
    const review = await ProductReview.findOne({
      _id: reviewId,
      userId: userId,
    });
    if (!review) {
      return res.status(404).json({
        status: "Failed",
        message: "Review not found or unauthorized",
      });
    }

    console.log("review", review);

    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    await review.save();
    await ProductReview.calcAverageRatings(review.productId);

    res.status(200).json({
      status: "Success",
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error updating review",
      error: error.message,
    });
  }
};

export const deleteProductReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.userId;
  try {
    const review = await ProductReview.findOne({
      _id: reviewId,
      userId: userId,
    });
    if (!review) {
      return res.status(404).json({
        status: "Failed",
        message: "Review not found or unauthorized",
      });
    }
    await review.deleteOne();
    await ProductReview.calcAverageRatings(review.productId);

    res.status(200).json({
      status: "Success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error deleting review",
      error: error.message,
    });
  }
};
