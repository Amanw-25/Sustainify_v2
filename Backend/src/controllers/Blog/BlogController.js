import { BlogPost } from "../../models/index.js";
import cloudinary from "../../config/cloudinaryConfig.js";

export const createBlogPost = async (req, res) => {
  const user = req.userId;
  try {
    const {
      title,
      kicker,
      content,
      isMemberOnly,
      tags,
      readTime,
      previewImage,
    } = req.body;

    if (!title || !kicker || !content || !tags || !readTime) {
      return res.status(400).json({
        success: false,
        message: "Title, kicker, content, tags, and readTime are required",
      });
    }

    const DEFAULT_IMAGE =
      "https://sb.ecobnb.net/app/uploads/sites/3/2023/05/Green-Blogging-How-to-Start-a-Sustainable-Living-Blog-1-1170x490.jpg";

    let finalPreviewImage =
      previewImage && previewImage.trim() !== "" ? previewImage : DEFAULT_IMAGE;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file, index) =>
          new Promise((resolve, reject) => {
            cloudinary.v2.uploader
              .upload_stream(
                {
                  folder: "blog",
                  public_id: `blog_${Date.now()}_${index}`,
                },
                (error, result) => {
                  if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                  } else {
                    resolve({
                      url: result.secure_url,
                      publicId: result.public_id,
                    });
                  }
                }
              )
              .end(file.buffer);
          })
      );

      try {
        const uploadedImages = await Promise.all(uploadPromises);
        if (uploadedImages.length > 0) {
          finalPreviewImage = uploadedImages[0].url;
          console.log("Uploaded new image, using:", finalPreviewImage);
        }
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    const newBlogPost = new BlogPost({
      title,
      kicker,
      content,
      previewImage: finalPreviewImage,
      author: user,
      isMemberOnly,
      tags,
      readTime,
    });

    await newBlogPost.save();

    res.json({
      success: true,
      message: "Blog post created successfully",
      data: newBlogPost,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error creating blog post",
      error: error.message,
    });
  }
};

export const getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find().populate(
      "author",
      "name email profilePhoto"
    );

    res.json({
      success: true,
      message: "Blog posts retrieved successfully",
      data: blogPosts,
    });
  } catch (error) {
    console.error("Error getting blog posts:", error);
    res.status(500).json({
      success: false,
      message: "Error getting blog posts",
      error: error.message,
    });
  }
};

export const getSingleBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    const blogPost = await BlogPost.findById(id).populate(
      "author",
      "name email profilePhoto"
    );

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.json({
      success: true,
      message: "Blog post retrieved successfully",
      data: blogPost,
    });
  } catch (error) {
    console.error("Error getting blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error getting blog post",
      error: error.message,
    });
  }
};

export const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const user = req.userId;

  try {
    const blogPost = await BlogPost.findOne({ _id: id, author: user });
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found or unauthorized",
      });
    }

    const { title, kicker, content, isMemberOnly, tags, readTime } = req.body;

    let previewImage = blogPost.previewImage;

    if (req.files && req.files.length > 0) {
      if (blogPost.previewImage) {
        const publicId = blogPost.previewImage.split("/").pop().split(".")[0];
        await cloudinary.v2.uploader.destroy(publicId);
      }

      const uploadResults = await Promise.all(
        req.files.map(
          (file, index) =>
            new Promise((resolve, reject) => {
              cloudinary.v2.uploader
                .upload_stream(
                  {
                    folder: "blog",
                    public_id: `blog_${Date.now()}_${index}`,
                  },
                  (error, result) => {
                    if (error) {
                      console.error("Cloudinary Upload Error:", error);
                      reject(error);
                    } else {
                      resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                      });
                    }
                  }
                )
                .end(file.buffer);
            })
        )
      );
      previewImage = (await Promise.all(uploadResults))[0].url;
    }

    blogPost.title = title || blogPost.title;
    blogPost.kicker = kicker || blogPost.kicker;
    blogPost.content = content || blogPost.content;
    blogPost.previewImage = previewImage || blogPost.previewImage;
    blogPost.isMemberOnly = isMemberOnly || blogPost.isMemberOnly;
    blogPost.tags = tags || blogPost.tags;
    blogPost.readTime = readTime || blogPost.readTime;
    blogPost.previewImage = previewImage;
    blogPost.updatedAt = Date.now();

    // if (!req.files || req.files.length === 0) {
    //   blogPost.previewImage = blogPost.previewImage || 'https://sb.ecobnb.net/app/uploads/sites/3/2023/05/Green-Blogging-How-to-Start-a-Sustainable-Living-Blog-1-1170x490.jpg';
    // }

    await blogPost.save();

    res.json({
      success: true,
      message: "Blog post updated successfully",
      data: blogPost,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error updating blog post",
      error: error.message,
    });
  }
};

export const deleteBlogPost = async (req, res) => {
  const { id } = req.params;
  const user = req.userId;
  try {
    const blogPost = await BlogPost.findOneAndDelete({ _id: id, author: user });
    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting blog post",
      error: error.message,
    });
  }
};
