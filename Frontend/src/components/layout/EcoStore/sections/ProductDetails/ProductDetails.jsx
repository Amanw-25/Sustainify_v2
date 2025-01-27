import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import userImg from "../../../../../assets/images/user.png";

const ProductDetails = () => {
  const [tab, setTab] = useState("details");
  const [mainImage, setMainImage] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);
  const zoomRef = useRef(null);

  // Static product data
  const product = {
    name: "Smartphone X Pro",
    images: [
      "https://images.unsplash.com/photo-1624377638671-904e9428f79c?q=80&w=1935&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1158&q=80",
      "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1624377478528-8e90d1d4cf91?q=80&w=1935&auto=format&fit=crop",
    ],
    price: 899.99,
    discountPrice: 999.99,
    shortDescription:
      "A high-performance smartphone with cutting-edge features.",
    description:
      "The Smartphone X Pro offers a sleek design, top-tier performance, and an exceptional camera for capturing your best moments. It features a long-lasting battery, vibrant display, and high-speed connectivity.",
    specifications: [
      "6.7-inch AMOLED Display",
      "Triple Camera System (108 MP + 12 MP + 8 MP)",
      "8GB RAM, 256GB Storage",
      "5000mAh Battery with Fast Charging",
    ],
    Category: "Electronics",
    averageRating: 4.5,
    reviews: [
      {
        rating: 5,
        comment: "Amazing phone! The display is stunning.",
        reviewerName: "John Doe",
      },
      {
        rating: 4,
        comment: "Great value for money, but the battery could last longer.",
        reviewerName: "Jane Smith",
      },
    ],
    stock: 12,
    deliveryEstimate: "2-3 business days",
  };

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, []);

  const handleThumbnailClick = (image) => {
    setImageLoading(true);
    setMainImage(image);
  };

  const handleImageZoom = (e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    // Ensure values stay within bounds
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));

    setZoomPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseEnter = () => {
    if (zoomRef.current) {
      zoomRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (zoomRef.current) {
      zoomRef.current.style.opacity = "0";
    }
  };

  return (
    <section>
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8 mt-[30px] lg:mt-[55px]">
        <div className="grid md:grid-cols-3 gap-[50px]">
          {/* Product Images and Main Display */}
          <div className="md:col-span-2 flex gap-5">
            {/* Left Side Thumbnail Images */}
            <div className="flex flex-col gap-3">
              {product.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    onClick={() => handleThumbnailClick(image)}
                    onError={(e) => {
                      e.target.src = userImg;
                    }}
                    className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-all duration-300 hover:opacity-90 ${
                      mainImage === image
                        ? "border-2 border-blue-600 shadow-lg"
                        : "border border-gray-200"
                    }`}
                  />
                  {mainImage === image && (
                    <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-lg pointer-events-none" />
                  )}
                </div>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div className="relative">
              <div
                ref={imageContainerRef}
                className="relative w-80 h-80 overflow-hidden rounded-3xl"
                onMouseMove={handleImageZoom}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={mainImage}
                  alt="Main product"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.target.src = userImg;
                    setImageLoading(false);
                  }}
                  className="w-full h-full object-cover"
                />
                
                {/* Zoom overlay */}
                <div
                  ref={zoomRef}
                  className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none transition-opacity duration-200"
                  style={{
                    backgroundImage: `url(${mainImage})`,
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
                  <FaStar className="text-yellow-500" />{" "}
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
                  {product.reviews.length} Reviews
                </span>
              </div>
              <p className="text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px] mb-3">
                {product.shortDescription}
              </p>
              <span className="bg-[#ccf0f3] mt-4 text-irisBlueColor py-4 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold">
                {product.Category}
              </span>
            </div>
          </div>

          {/* Side Panel for Purchase */}
          <div className="relative h-full">
            <div className="sticky top-10 p-6 border rounded-lg shadow-md bg-white min-h-[300px]">
              <h4 className="text-[20px] font-bold mb-4">Buy Now</h4>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-[24px] font-bold text-primaryColor">
                  ${product.price}
                </h2>
                {product.discountPrice && (
                  <span className="text-[18px] line-through text-gray-500">
                    ${product.discountPrice}
                  </span>
                )}
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
                <p className="text-[15px] text-green-600 font-bold mb-2">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
                <p className="text-[15px] text-gray-500">
                  Delivery: {product.deliveryEstimate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Details and Reviews */}
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
            <div>
              <h4 className="text-[18px] font-bold">Specifications</h4>
              <ul className="list-disc ml-5 text-[14px]">
                {product.specifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
              <p className="mt-4">{product.description}</p>
            </div>
          )}
          {tab === "reviews" && (
            <div>
              {product.reviews.length > 0 ? (
                product.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4 mb-2">
                      <img
                        src={userImg}
                        alt={review.reviewerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <FaStar className="text-yellow-500" />
                          <span className="font-semibold">
                            {review.rating.toFixed(1)} / 5
                          </span>
                        </div>
                        <p className="text-gray-800">{review.comment}</p>
                        <span className="text-sm text-gray-500">
                          - {review.reviewerName}
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
    </section>
  );
};

export default ProductDetails;
