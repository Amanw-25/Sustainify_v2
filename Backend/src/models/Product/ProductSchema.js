import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  carbonFootprint: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  images: { type: Array, default: [] },
  reviews: { type: [String], default: [] },
  totalRating: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
