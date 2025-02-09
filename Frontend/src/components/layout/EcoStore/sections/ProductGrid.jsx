import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { BASE_URL } from "../../../../config.js";
import ProductCard from "./ProductCard";
import Loading from "../../../../Loader/Loading.jsx";
import Cart from "./Cart/Cart.jsx";
import "swiper/css";
import "swiper/css/navigation";
import "./ProductGrid.css";

const CART_STORAGE_KEY = 'eco-store-cart';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const { items, timestamp } = JSON.parse(savedCart);
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
          return [];
        }
        return items;
      }
      return [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: cart,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.status === "Success") {
          setProducts(data.products);
          const uniqueCategories = [
            ...new Set(data.products.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          setError("Failed to fetch products");
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item._id === product._id);
      if (existingItem) {
        return currentCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { 
        ...product, 
        quantity: 1,
        image: product.image 
      }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(currentCart => 
      currentCart.map(item => {
        if (item._id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item._id !== productId));
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });
      
      const { sessionId } = await response.json();
      
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (!error) {
        setCart([]);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error in checkout:', error);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ position: 'relative' }}>
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          textAlign: "center",
          fontWeight: "bold",
          color: "#004d40",
        }}
      >
        Featured Eco-Friendly Products
      </Typography>

      {categories.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: "center", 
            color: "gray" 
          }}
        >
          No products available
        </Typography>
      ) : (
        categories.map((category) => {
          const filteredProducts = products.filter(
            (product) => product.category === category
          );

          return (
            <Box key={category} sx={{ mb: 5 }}>
              <Typography
                variant="h4"
                sx={{ mb: 2, ml: 4, fontWeight: "bold", color: "#004d40" }}
              >
                {category} Products
              </Typography>
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                spaceBetween={10}
                slidesPerView={6}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  600: { slidesPerView: 2 },
                  900: { slidesPerView: 4 },
                  1200: { slidesPerView: 5 },
                }}
              >
                {filteredProducts.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard 
                      product={product} 
                      onAddToCart={() => addToCart(product)}
                    />
                  </SwiperSlide>
                ))}
                <div className="swiper-button-next"></div>
                <div className="swiper-button-prev"></div>
              </Swiper>
            </Box>
          );
        })
      )}

      <Cart 
        isOpen={isCartOpen}
        onClose={setIsCartOpen}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </Box>
  );
};

export default ProductGrid;