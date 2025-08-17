import { BlogReview } from "../../models/index.js";

export const createBlogReview = async (req, res) => {
  const { comment, rating } = req.body;
  const userId = req.userId;
  const blogPostId = req.params.id;
  try {
    if (!comment || !rating) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const review = new BlogReview({
      userId,
      blogPostId,
      comment,
      rating,
    });

    await review.save();

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getBlogReviews = async (req, res) => {
  const { blogPostId } = req.params;
  try {
    const reviews = await BlogReview.find({ blogPostId }).populate({
      path: "userId",
      select: "name profilePhoto",
    });
    res.status(200).json({
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateBlogReview = async (req, res) => {
  const { reviewId } = req.params;
  const { comment, rating } = req.body;
  const userId = req.userId;

  try {
    const review = await BlogReview.findOne({
      _id: reviewId,
      userId: userId,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.comment = comment;
    review.rating = rating;

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
