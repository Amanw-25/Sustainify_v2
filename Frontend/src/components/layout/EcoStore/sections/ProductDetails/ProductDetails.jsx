// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
// import { loadStripe } from "@stripe/stripe-js";
// import { BASE_URL } from "../../../../../config";
// import { useCart } from "../../../../../hooks/useCart";
// import { toast } from "react-toastify";
// import Loading from "../../../../../Loader/Loading";
// import Error from "../../../../../Error/Error";
// import Cart from "../Cart/Cart";

// const ProductDetails = () => {
//   const [tab, setTab] = useState("details");
//   const [reviews, setReviews] = useState([]);
//   const [mainImage, setMainImage] = useState("");
//   const [imageLoading, setImageLoading] = useState(true);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const imageContainerRef = useRef(null);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const zoomRef = useRef(null);

//   const { id } = useParams();
//   const { cart, fetchCart, addToCart, updateQuantity, removeFromCart } =
//     useCart();
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${BASE_URL}/product/${id}`);
//         const data = await response.json();

//         if (response.ok && data.status === "Success") {
//           setProduct(data.product);
//           if (data.product.images?.length > 0) {
//             setMainImage(data.product.images[0].url);
//           }
//         } else {
//           setError(data.message || "Failed to fetch product details");
//         }
//       } catch (error) {
//         console.error("Product fetch error:", error);
//         setError("Error fetching product details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductDetails();
//   }, [id]);

//   useEffect(() => {
//     const fetchReviews = async () => {
//       if (tab !== "reviews") return;

//       try {
//         const response = await fetch(`${BASE_URL}/product/review/${id}`);
//         const data = await response.json();

//         if (response.ok && data.status === "Success") {
//           setReviews(data.reviews);
//         } else {
//           console.error("Failed to fetch reviews:", data.message);
//         }
//       } catch (error) {
//         console.error("Review fetch error:", error);
//       }
//     };

//     fetchReviews();
//   }, [id, tab]);

//   const handleCheckout = async () => {
//     try {
//       if (!cart || !cart.items || cart.items.length === 0) {
//         toast.warn("Cart is empty");
//         return;
//       }

//       if (!token) {
//         toast.error("Please login to checkout");
//         return;
//       }

//       const formattedItems = cart.items.map((item) => ({
//         productId: item.product._id,
//         quantity: item.quantity,
//       }));

//       const response = await fetch(
//         `${BASE_URL}/checkout/create-checkout-session`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ items: formattedItems }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         toast.error(data.message || "Checkout failed");
//         return;
//       }

//       const { sessionId } = data;

//       const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
//       if (!stripeKey) {
//         toast.error("Stripe configuration is missing");
//         return;
//       }

//       const stripe = await loadStripe(stripeKey);
//       if (!stripe) {
//         toast.error("Failed to initialize Stripe");
//         return;
//       }

//       const { error: stripeError } = await stripe.redirectToCheckout({
//         sessionId,
//       });

//       if (stripeError) {
//         toast.error(stripeError.message || "Stripe checkout failed");
//         return;
//       }
//     } catch (err) {
//       console.error("Checkout error:", err);
//       toast.warn("An error occurred during checkout");
//     }
//   };

//   const handleImageZoom = useCallback((e) => {
//     if (!imageContainerRef.current) return;

//     const { left, top, width, height } =
//       imageContainerRef.current.getBoundingClientRect();
//     const x = ((e.clientX - left) / width) * 100;
//     const y = ((e.clientY - top) / height) * 100;

//     const boundedX = Math.max(0, Math.min(100, x));
//     const boundedY = Math.max(0, Math.min(100, y));

//     setZoomPosition({ x: boundedX, y: boundedY });
//   }, []);

//   const handleMouseEnter = useCallback(() => {
//     if (zoomRef.current) {
//       zoomRef.current.style.opacity = "1";
//     }
//   }, []);

//   const handleMouseLeave = useCallback(() => {
//     if (zoomRef.current) {
//       zoomRef.current.style.opacity = "0";
//     }
//   }, []);

//   const handleAddToCart = async () => {
//     try {
//       if (!product) return;

//       await addToCart(product);
//       await fetchCart();
//       setIsCartOpen(true);
//     } catch (error) {
//       toast.error("Error adding to cart:");
//     }
//   };

//   if (loading) return <Loading />;
//   if (error) return <Error message={error} />;
//   if (!product) return <div>Product not found</div>;
//   const currentDisplayImage =
//     mainImage || (product.images[0] && product.images[0].url);

//   return (
//     <section>
//       <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 mt-[30px] lg:mt-[55px]">
//         <div className="grid md:grid-cols-3 gap-[50px]">
//           <div className="md:col-span-2 flex gap-5">
//             <div className="flex flex-col gap-3">
//               {product.images.slice(0, 3).map((image, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={image.url}
//                     alt={`Product thumbnail ${index + 1}`}
//                     onClick={() => setMainImage(image.url)}
//                     className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-all duration-300 hover:opacity-90
//                       ${
//                         mainImage === image.url
//                           ? "border-2 border-blue-600 shadow-lg"
//                           : "border border-gray-200"
//                       }`}
//                   />
//                   {mainImage === image.url && (
//                     <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-lg pointer-events-none" />
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Main Image with Zoom */}
//             <div className="relative">
//               <div
//                 ref={imageContainerRef}
//                 className="relative w-80 h-80 overflow-hidden rounded-3xl"
//                 onMouseMove={handleImageZoom}
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <img
//                   src={currentDisplayImage}
//                   alt="Main product"
//                   onLoad={() => setImageLoading(false)}
//                   className="w-full h-full object-cover"
//                 />

//                 <div
//                   ref={zoomRef}
//                   className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none transition-opacity duration-200"
//                   style={{
//                     backgroundImage: `url(${currentDisplayImage})`,
//                     backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
//                     backgroundSize: "200%",
//                     backgroundRepeat: "no-repeat",
//                   }}
//                 />

//                 {imageLoading && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Product Info */}
//             <div>
//               <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
//                 {product.name}
//               </h3>
//               <div className="flex items-center gap-[6px]">
//                 <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
//                   <FaStar className="text-yellow-500" />
//                   {product.averageRating?.toFixed(1)}
//                 </span>
//                 <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
//                   ({product.reviews?.length || 0} Reviews)
//                 </span>
//               </div>
//               <p className="text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px] mb-3 mt-3">
//                 {product.shortdescription}
//               </p>
//               <span className="bg-[#ccf0f3] mt-4 text-irisBlueColor py-4 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold">
//                 {product.category}
//               </span>
//             </div>
//           </div>

//           {/* Buy Now Section */}
//           <div className="relative h-full">
//             <div className="sticky top-10 p-6 border rounded-lg shadow-md bg-white min-h-[300px]">
//               <h4 className="text-[20px] font-bold mb-4">Buy Now</h4>
//               <div className="flex items-center gap-3 mb-6">
//                 <h2 className="text-[24px] font-bold text-primaryColor">
//                   ₹{product.price}
//                 </h2>
//               </div>

//               <button
//                 onClick={handleAddToCart}
//                 disabled={!product.stock}
//                 className={`mt-6 w-full ${
//                   product.stock
//                     ? "bg-[#004d40] hover:bg-[#00695c]"
//                     : "bg-gray-400 cursor-not-allowed"
//                 } text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300`}
//               >
//                 <FaShoppingCart size={20} />
//                 {product.stock ? "Add to Cart" : "Out of Stock"}
//               </button>

//               <button
//                 onClick={handleCheckout}
//                 disabled={!cart?.items?.length}
//                 className={`mt-6 w-full ${
//                   cart?.items?.length
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-gray-400 cursor-not-allowed"
//                 } text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300`}
//               >
//                 Buy Now
//               </button>

//               <button className="mt-3 w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors duration-300">
//                 <FaHeart className="text-red-500" size={20} />
//                 Add to Wishlist
//               </button>

//               <div className="mt-6">
//                 {product.stock < 10 && product.stock > 0 && (
//                   <p className="text-[15px] text-red-600 font-bold mb-2">
//                     Only {product.stock} left
//                   </p>
//                 )}
//                 <p className="text-[15px] text-green-600 font-bold mb-2">
//                   {product.stock > 0 ? "In Stock" : "Out of Stock"}
//                 </p>
//                 <p className="text-[15px] text-gray-500">
//                   Carbon Footprint: {product.carbonFootprint} kg CO2
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
//           <button
//             onClick={() => setTab("details")}
//             className={`${
//               tab === "details" && "border-b border-solid border-primaryColor"
//             } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
//           >
//             Product Details
//           </button>
//           <button
//             onClick={() => setTab("reviews")}
//             className={`${
//               tab === "reviews" && "border-b border-solid border-primaryColor"
//             } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
//           >
//             Reviews
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="mt-[50px]">
//           {tab === "details" ? (
//             <div className="p-4">
//               <h3 className="text-[20px] font-bold mb-4">
//                 Product Description
//               </h3>
//               <p className="text-gray-700">{product.description}</p>

//               <h4 className="text-[20px] font-bold mt-6 mb-2">
//                 Product Specifications
//               </h4>
//               <ul className="list-decimal pl-5 text-gray-700">
//                 {product.specifications?.map((spec, index) => (
//                   <li key={index}>{spec}</li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <div>
//               {reviews.length > 0 ? (
//                 reviews.map((review) => (
//                   <div
//                     key={review._id}
//                     className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
//                   >
//                     <div className="flex items-start gap-4 mb-2">
//                       <img
//                         src={review.userId?.profilePhoto}
//                         alt={review.userId?.name || "User"}
//                         className="w-12 h-12 rounded-full object-cover"
//                       />
//                       <div>
//                         <h4 className="font-semibold">
//                           {review.userId?.name || "Anonymous"}
//                         </h4>
//                         <div className="flex items-center gap-2">
//                           <FaStar className="text-yellow-500" />
//                           <span className="font-semibold">
//                             {review.rating} / 5
//                           </span>
//                         </div>
//                         <p className="text-gray-800">{review.comment}</p>
//                         <span className="text-sm text-gray-500">
//                           {new Date(review.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No reviews yet.</p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Cart Component */}
//         <Cart
//           isOpen={isCartOpen}
//           setIsCartOpen={setIsCartOpen}
//           cart={cart}
//           onUpdateQuantity={updateQuantity}
//           onRemoveItem={removeFromCart}
//           onCheckout={handleCheckout}
//         />
//       </div>
//     </section>
//   );
// };

// export default ProductDetails;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {ProductImages} from "./ProductImageGallery";
import {ProductInfo }from "./ProductInfo";
import {BuySection} from "./BuySection";
import {ProductTabs} from "./ProductTabs";
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
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 mt-[30px] lg:mt-[55px]">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <ProductImages
            images={product.images}
            mainImage={mainImage}
            setMainImage={setMainImage}
            handleImageZoom={handleImageZoom}
            zoomPosition={zoomPosition}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />
          <ProductInfo product={product} />
          <BuySection
            product={product}
            cart={cart}
            handleAddToCart={handleAddToCart}
            handleCheckout={handleCheckout}
          />
        </div>

        <ProductTabs
          tab={tab}
          setTab={setTab}
          product={product}
          reviews={reviews}
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
