import { Product } from "../../models/index.js";
import cloudinary from "../../config/cloudinaryConfig.js";

const addProduct = async (req, res) => {
  const { 
    name, 
    shortdescription, 
    description, 
    specifications, 
    price, 
    carbonFootprint, 
    stock, 
    category, 
    deliveryEstimate 
  } = req.body;

  if (!name || !shortdescription || !description || !price || !carbonFootprint || !stock || !category) {
    return res.status(400).json({
      status: "Failed",
      message: "All fields, including short description and category, are required",
    });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: "Failed",
      message: "No files uploaded",
    });
  }

  try {
    const uploadPromises = req.files.map((file, index) =>
      new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          {
            folder: "products",
            public_id: `product_${Date.now()}_${index}`,
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
        ).end(file.buffer);
      })
    );

    const images = await Promise.all(uploadPromises);

    const product = new Product({
      name,
      shortdescription,
      description,
      specifications: specifications || [], 
      price,
      carbonFootprint,
      stock,
      category,
      images,
      reviews: [],
      totalRating: 0,
      averageRating: 0,
      deliveryEstimate: deliveryEstimate || "Standard Delivery",
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
  const { 
    name, 
    shortdescription, 
    description, 
    specifications, 
    price, 
    stock, 
    category, 
    carbonFootprint, 
    deliveryEstimate 
  } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "Failed",
      message: "Product ID not provided",
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
        await cloudinary.v2.uploader.destroy(image.publicId);
      }

      images = await Promise.all(
        req.files.map((file, index) => 
          new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
              {
                folder: "products",
                public_id: `product_${Date.now()}_${index}`,
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
            ).end(file.buffer);
          })
        )
      );
    }

    product.name = name || product.name;
    product.shortdescription = shortdescription || product.shortdescription;
    product.description = description || product.description;
    product.specifications = specifications || product.specifications;
    product.price = price || product.price;
    product.carbonFootprint = carbonFootprint || product.carbonFootprint;
    product.stock = stock || product.stock;
    product.category = category || product.category;
    product.deliveryEstimate = deliveryEstimate || product.deliveryEstimate;
    product.images = images;
    product.updatedAt = Date.now();

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
