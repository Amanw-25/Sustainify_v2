import { SavedBlog } from "../../models/index.js";

export const saveBlog = async (req, res) => {
  const { blogId } = req.query;
  const id = req.userId;
  try {
    const savedBlog = await SavedBlog.findOne({ blogId, userId: id });
    if (savedBlog) {
      return res.status(400).json({
        success: false,
        message: "Blog already saved",
      });
    }

    const newSavedBlog = new SavedBlog({
      blogId,
      userId: id,
    });

    await newSavedBlog.save();
    res.status(201).json({
      success: true,
      message: "Blog saved successfully",
      data: newSavedBlog,
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({
      success: false,
      message: "Error saving blog",
      error: error.message,
    });
  }
};

export const getSavedBlog = async (req, res) => {
  const id = req.userId;

  try {
    const savedBlog = await SavedBlog.find({ userId: id }).populate(
      "blogId",
      "title previewImage"
    );

    if (savedBlog.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No Saved blog not found",
      });
    }

    res.json({
      success: true,
      message: "Saved blog retrieved successfully",
      data: savedBlog,
    });
  } catch (error) {
    console.error("Error getting saved blog:", error);
    res.status(500).json({
      success: false,
      message: "Error getting saved blog",
      error: error.message,
    });
  }
};

export const deleteSavedBlog = async (req, res) => {
  const {id} = req.params;
  try {
    const savedBlog = await SavedBlog.findOneAndDelete({ blogId:id});
    if (!savedBlog) {
      return res.status(404).json({
        success: false,
        message: "Saved blog not found",
      });
    }

    res.json({
      success: true,
      message: "Saved blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting saved blog:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting saved blog",
      error: error.message,
    });
  }
};
