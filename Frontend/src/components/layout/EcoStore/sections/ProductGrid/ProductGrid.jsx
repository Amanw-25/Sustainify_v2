import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import Loading from "../../../../../Loader/Loading";
import Cart from "../Cart/Cart";
import { useCart } from "../../../../../hooks/useCart";
import { useProducts } from "../../../../../hooks/useProducts";
import ProductCategory from "../ProductCategory/ProductCategory";
import { BASE_URL } from "../../../../../config";

const ProductGrid = () => {
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const { products, categories, loading, error } = useProducts();
  const { cart, fetchCart, addToCart, updateQuantity, removeFromCart } = useCart();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);


  const handleCheckout = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/checkout/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: cart }),
        }
      );

      const { sessionId } = await response.json();
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (!error) {
        await fetch(`${BASE_URL}/cart/clear`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCart();
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ position: "relative" }}>
      <Typography
        variant="h3"
        sx={{ mb: 3, textAlign: "center", fontWeight: "bold", color: "#004d40" , mt: 5}}
      >
        Featured Eco-Friendly Products
      </Typography>

      {categories.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
          No products available
        </Typography>
      ) : (
        categories.map((category) => (
          <ProductCategory
            key={category}
            category={category}
            products={products}
            onAddToCart={addToCart}
          />
        ))
      )}

        <Cart
          isOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
    </Box>
  );
};

export default ProductGrid;
