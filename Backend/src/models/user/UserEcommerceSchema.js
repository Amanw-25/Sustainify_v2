import mongoose from "mongoose";

const userEcommerceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
  purchasedItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      purchaseDate: { type: Date, default: Date.now },
      quantity: { type: Number, default: 1 },
    },
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], wishlist
});

const UserEcommerce = mongoose.model("UserEcommerce", userEcommerceSchema);
export default UserEcommerce;