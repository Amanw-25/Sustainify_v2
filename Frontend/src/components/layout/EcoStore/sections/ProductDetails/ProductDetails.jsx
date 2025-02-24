import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { ProductImages } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { BuySection } from "./BuySection";
import { ProductTabs } from "./ProductTabs";
import { BASE_URL } from "../../../../../config";
import { useCart } from "../../../../../hooks/useCart";
import { toast } from "react-toastify";
import Loading from "../../../../../Loader/Loading";
import Error from "../../../../../Error/Error";
import Cart from "../Cart/Cart";

const ProductDetails = () => {
  const [tab, setTab] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const zoomRef = useRef(null);

  const { id } = useParams();
  const { cart, fetchCart, addToCart, updateQuantity, removeFromCart } =
    useCart();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/product/${id}`);
        const data = await response.json();

        if (response.ok && data.status === "Success") {
          setProduct(data.product);
          if (data.product.images?.length > 0) {
            setMainImage(data.product.images[0].url);
          }
        } else {
          setError(data.message || "Failed to fetch product details");
        }
      } catch (error) {
        console.error("Product fetch error:", error);
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (tab !== "reviews") return;

      try {
        const response = await fetch(`${BASE_URL}/product/review/${id}`);
        const data = await response.json();

        if (response.ok && data.status === "Success") {
          setReviews(data.reviews);
        } else {
          console.error("Failed to fetch reviews:", data.message);
        }
      } catch (error) {
        console.error("Review fetch error:", error);
      }
    };

    fetchReviews();
  }, [id, tab]);

  const handleCheckout = async () => {
    try {
      if (!cart || !cart.items || cart.items.length === 0) {
        toast.warn("Cart is empty");
        return;
      }

      if (!token) {
        toast.error("Please login to checkout");
        return;
      }

      const formattedItems = cart.items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const response = await fetch(
        `${BASE_URL}/checkout/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ items: formattedItems }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Checkout failed");
        return;
      }

      const { sessionId } = data;

      const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      if (!stripeKey) {
        toast.error("Stripe configuration is missing");
        return;
      }

      const stripe = await loadStripe(stripeKey);
      if (!stripe) {
        toast.error("Failed to initialize Stripe");
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        toast.error(stripeError.message || "Stripe checkout failed");
        return;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.warn("An error occurred during checkout");
    }
  };

  const handleImageZoom = useCallback((e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    setZoomPosition({ x: boundedX, y: boundedY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (zoomRef.current) {
      zoomRef.current.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (zoomRef.current) {
      zoomRef.current.style.opacity = "0";
    }
  }, []);

  const handleAddToCart = async () => {
    try {
      if (!product) return;

      await addToCart(product);
      await fetchCart();
      setIsCartOpen(true);
    } catch (error) {
      toast.error("Error adding to cart:");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!product) return <div>Product not found</div>;

  return (
    <section>
      <div className="max-w-[1170px] mx-auto px-4 sm:px-2 lg:px-8 mt-[30px] lg:mt-[55px]">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-5">
            <ProductImages
              images={product.images}
              mainImage={mainImage}
              setMainImage={setMainImage}
              handleImageZoom={handleImageZoom}
              zoomPosition={zoomPosition}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          </div>

          <div className="flex-1">
            <ProductInfo product={product} />
          </div>

          <div className="flex-1">
            <BuySection
              product={product}
              cart={cart}
              handleAddToCart={handleAddToCart}
              handleCheckout={handleCheckout}
            />
          </div>
        </div>

          <ProductTabs
          tab={tab}
          setTab={setTab}
          product={product}
          reviews={reviews}
          setReviews={setReviews}
        />

        <Cart
          isOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
      </div>
    </section>
  );
};
export default ProductDetails;
