import { useState, useCallback } from "react";
import { BASE_URL } from "../config.js";

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const token = localStorage.getItem("token");

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setCart(data);
      } else {
        setCart({ items: [] }); // Match the controller's empty cart response
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
      setCart({ items: [] });
    }
  }, [token]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          productId: product._id, 
          quantity: Math.max(1, quantity) // Ensure quantity is at least 1
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setCart(data); // Use the returned cart data directly
        return true;
      }
      return false;
    } catch (error) {
      console.error("Add to cart error:", error);
      return false;
    }
  }, [token]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setCart(data); // Use the returned cart data
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update quantity error:", error);
      return false;
    }
  }, [token]);
  
  const removeFromCart = useCallback(async (productId) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
      if (response.ok) {
        setCart(data); // Use the returned cart data
        return true;
      }
      return false;
    } catch (error) {
      console.error("Remove from cart error:", error);
      return false;
    }
  }, [token]);

  const clearCart = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCart({ items: [] });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Clear cart error:", error);
      return false;
    }
  }, [token]);

  return {
    cart,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};