
  import React, { useState, useEffect, useRef, useCallback } from "react";
  import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
  import { useParams } from "react-router-dom";
  import { BASE_URL } from "../../../../../config.js";
  
  const ProductDetails = () => {
    const [tab, setTab] = useState("details");
    const [reviews, setReviews] = useState([]);
    const [mainImage, setMainImage] = useState("");
    const [imageLoading, setImageLoading] = useState(true);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const imageContainerRef = useRef(null);
    const zoomRef = useRef(null);
  
    const { id } = useParams();
  
    const handleThumbnailClick = (imageUrl) => {
      setImageLoading(true);
      setMainImage(imageUrl);
    };
  
    const handleImageZoom = useCallback((e) => {
      if (!imageContainerRef.current) return;
  
      const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
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
  
    useEffect(() => {
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`${BASE_URL}/product/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data.status === "Success") {
            setProduct(data.product);
            if (data.product.images && data.product.images.length > 0) {
              setMainImage(data.product.images[0].url);
            }
          } else {
            setError("Failed to fetch product details");
          }
        } catch (error) {
          setError("Error fetching product details");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProductDetails();
    }, [id]);
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${BASE_URL}/product/review/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data.status === "Success") {
            setReviews(data.reviews);
          } else {
            setError("Failed to fetch reviews");
          }
        } catch (error) {
          setError("Error fetching reviews");
          console.error(error);
        }
      };
  
      if (tab === "reviews") {
        fetchReviews();
      }
    }, [id, tab]);
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found</div>;
  
    const currentDisplayImage = mainImage || (product.images[0] && product.images[0].url);
  
    return (
      <section>
        <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 mt-[30px] lg:mt-[55px]">
          <div className="grid md:grid-cols-3 gap-[50px]">
            <div className="md:col-span-2 flex gap-5">
              <div className="flex flex-col gap-3">
                {product.images.slice(0).map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Product thumbnail ${index + 1}`}
                      onClick={() => handleThumbnailClick(image.url)}
                      className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-all duration-300 hover:opacity-90 ${
                        currentDisplayImage === image.url
                          ? "border-2 border-blue-600 shadow-lg"
                          : "border border-gray-200"
                      }`}
                    />
                    {currentDisplayImage === image.url && (
                      <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-lg pointer-events-none" />
                    )}
                  </div>
                ))}
              </div>
  
              <div className="relative">
                <div
                  ref={imageContainerRef}
                  className="relative w-80 h-80 overflow-hidden rounded-3xl"
                  onMouseMove={handleImageZoom}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <img
                    src={currentDisplayImage}
                    alt="Main product"
                    onLoad={() => setImageLoading(false)}
                    className="w-full h-full object-cover"
                  />
                  
                  <div
                    ref={zoomRef}
                    className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none transition-opacity duration-200"
                    style={{
                      backgroundImage: `url(${currentDisplayImage})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: '200%',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
  
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
  
              <div>
                <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
                  {product.name}
                </h3>
                <div className="flex items-center gap-[6px]">
                  <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
                    <FaStar className="text-yellow-500" />
                    {product.averageRating.toFixed(1)}
                  </span>
                  <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                    {product.reviews.length} Reviews
                  </span>
                </div>
                <p className="text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px] mb-3 mt-3">
                  {product.description}
                </p>
                <span className="bg-[#ccf0f3] mt-4 text-irisBlueColor py-4 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold">
                  {product.category}
                </span>
              </div>
            </div>
  
            <div className="relative h-full">
              <div className="sticky top-10 p-6 border rounded-lg shadow-md bg-white min-h-[300px]">
                <h4 className="text-[20px] font-bold mb-4">Buy Now</h4>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-[24px] font-bold text-primaryColor">
                  &#8377;{product.price}
                  </h2>
                </div>
                <button className="mt-6 w-full bg-[#479CC9] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300">
                  <FaShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors duration-300">
                  Buy Now
                </button>
                <button className="mt-3 w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors duration-300">
                  <FaHeart className="text-red-500" size={20} />
                  Add to Wishlist
                </button>
                
                <div className="mt-6">
                  <p className="text-[15px] text-red-600 font-bold mb-2">
                    {product.stock < 10  && ` (Only ${product.stock} left)`}
                  </p>
                  <p className="text-[15px] text-green-600 font-bold mb-2">
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                  <p className="text-[15px] text-gray-500">
                    Carbon Footprint: {product.carbonFootprint} kg CO2
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
            <button
              onClick={() => setTab("details")}
              className={`${
                tab === "details" && "border-b border-solid border-primaryColor"
              } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold transition-colors duration-300`}
            >
              Product Details
            </button>
            <button
              onClick={() => setTab("reviews")}
              className={`${
                tab === "reviews" && "border-b border-solid border-primaryColor"
              } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold transition-colors duration-300`}
            >
              Reviews
            </button>
          </div>
  
          <div className="mt-[50px]">
            {tab === "details" && (
              <div className="p-4">
                <h3 className="text-[20px] font-bold mb-4">Product Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}
            
            <div className="mt-[50px]">
            {tab === "reviews" && (
              <div>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div
                      key={review._id || index}
                      className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-start gap-4 mb-2">
                        <img
                          src={review.userId?.profilePhoto}
                          alt={review.userId?.name || "User"}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{review.userId?.name || "Anonymous"}</h4>
                          <div className="flex items-center gap-2">
                            <FaStar className="text-yellow-500" />
                            <span className="font-semibold">
                              {review.rating} / 5
                            </span>
                          </div>
                          <p className="text-gray-800">{review.comment}</p>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default ProductDetails;