import { Cart, Product } from "../../models/index.js";

/** 
 * Cart Controller
 * Handles all cart-related operations
 */

/**
 * Add item to cart
 * @route POST /api/cart
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ 
        message: "Invalid request. Product ID and quantity > 0 required" 
      });
    }

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    
    // Populate product details before sending response
    await cart.populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Error adding item to cart",
      error: error.message 
    });
  }
};

/**
 * Remove item from cart
 * @route DELETE /api/cart/:productId
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate('items.product');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Error removing item from cart",
      error: error.message 
    });
  }
};

/**
 * Update item quantity in cart
 * @route PATCH /api/cart/quantity
 */
export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    if (!productId || !quantity || quantity < 0) {
      return res.status(400).json({ 
        message: "Invalid request. Product ID and quantity >= 0 required" 
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating item quantity",
      error: error.message 
    });
  }
};

/**
 * Get user's cart
 * @route GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching cart",
      error: error.message 
    });
  }
};

/**
 * Clear entire cart
 * @route DELETE /api/cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error clearing cart",
      error: error.message 
    });
  }
};