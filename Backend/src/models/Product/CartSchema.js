import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

// Main Cart Schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensures one cart per user
    },
    items: [cartItemSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// 🔹 Virtual Field for Total Price Calculation
cartSchema.virtual("totalPrice").get(function () {
  return this.items.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);
});

// 🔹 Middleware: Remove empty carts before saving
cartSchema.pre("save", function (next) {
  if (this.items.length === 0) {
    this.remove();
  }
  next();
});

const Cart=mongoose.model("Cart", cartSchema);
export default Cart;
