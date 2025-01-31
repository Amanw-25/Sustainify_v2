import { Product } from "../../models/index.js";
import cloudinary from "../../config/cloudinaryConfig.js";

const addProduct = async (req, res) => {
  const { name, description, price, carbonFootprint, stock, category ,images} =
    req.body;

  if (
    !name ||
    !description ||
    !price ||
    !stock ||
    !category ||
    !carbonFootprint ||
    !images 
  ) {
    return res.status(400).json({
      status: "Failed",
      message: "All fields, including category, are required",
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: "Failed",
      message: "No files uploaded",
    });
  }

  try {
    const images = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "products", // Upload to 'products' folder
              public_id: `product_${Date.now()}_${i}`, // Dynamic public_id to avoid overwriting
            },
            async (error, result) => {
              if (error) {
                console.error("Cloudinary Upload Error:", error);
                return reject(error);
              }

              images.push({
                url: result.secure_url,
                publicId: result.public_id,
              });

              resolve();
            }
          )
          .end(file.buffer);
      });
    }

    const product = new Product({
      name,
      description,
      price,
      carbonFootprint,
      stock,
      category,
      images,
    });

    await product.save();

    res.status(201).json({
      status: "Success",
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error adding product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category ,images} = req.body;

  if (!id) {
    res.status(500).json({
      status: "Failed",
      message: "ID not provided",
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found",
      });
    }

    let images = [...product.images];

    if (req.files && req.files.length > 0) {
      for (let image of product.images) {
        await cloudinary.v2.uploader.destroy(image.publicId); // Destroy the image from Cloudinary
      }

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await new Promise((resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              {
                folder: "products",
                public_id: `product_${Date.now()}_${i}`,
              },
              async (error, result) => {
                if (error) {
                  console.error("Cloudinary Upload Error:", error);
                  return reject(error);
                }

                images.push({
                  url: result.secure_url,
                  publicId: result.public_id,
                });

                resolve();
              }
            )
            .end(file.buffer);
        });
      }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.carbonFootprint = carbonFootprint || product.carbonFootprint;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.images = images;

    await product.save();

    res.status(200).json({
      status: "Success",
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error updating product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found",
      });
    }

    for (let image of product.images) {
      await cloudinary.v2.uploader.destroy(image.publicId);
    }

    await product.deleteOne();

    res.status(200).json({
      status: "Success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error deleting product",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No products found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "Failed",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      status: "Failed",
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
};
