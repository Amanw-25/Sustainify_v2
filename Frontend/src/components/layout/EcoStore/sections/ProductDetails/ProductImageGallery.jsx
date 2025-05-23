import React, { useRef, useState } from "react";

export const ProductImages = ({
  images,
  mainImage,
  setMainImage,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZoomActive, setIsZoomActive] = useState(false);
  
  const imageContainerRef = useRef(null);
  const zoomRef = useRef(null);

  // Function to handle zoom effect on mouse move
  const handleImageZoom = (e) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  // Show zoom effect on mouse enter
  const handleMouseEnter = () => {
    setIsZoomActive(true);
  };

  // Hide zoom effect on mouse leave
  const handleMouseLeave = () => {
    setIsZoomActive(false);
  };

  return (
    <div className="flex flex-col md:flex-row md:col-span-2 md:gap-5 gap-3">
      <div className="flex flex-row md:flex-col order-2 md:order-none gap-3 overflow-x-auto pb-2 md:pb-0">
        {images.slice(0, 3).map((image, index) => (
          <div key={index} className="relative flex-shrink-0">
            <img
              src={image.url}
              alt={`Product thumbnail ${index + 1}`}
              onClick={() => setMainImage(image.url)}
              className={`w-16 h-16 md:w-10 md:h-10 rounded-lg object-cover cursor-pointer transition-all duration-300 hover:opacity-90 
                ${mainImage === image.url ? "border-2 border-blue-600 shadow-lg" : "border border-gray-200"}`}
            />
            {mainImage === image.url && (
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-lg pointer-events-none" />
            )}
          </div>
        ))}
      </div>

      {/* Main image container */}
      <div className="relative order-1 md:order-none">
        <div
          ref={imageContainerRef}
          className="relative w-full md:w-80 aspect-square md:h-80 overflow-hidden rounded-xl md:rounded-3xl"
          onMouseMove={handleImageZoom}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={mainImage || (images[0] && images[0].url)}
            alt="Main product"
            onLoad={() => setImageLoading(false)}
            className="w-full h-full object-cover"
          />

          <div
            ref={zoomRef}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-200 pointer-events-none ${
              isZoomActive ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${mainImage || (images[0] && images[0].url)})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
            }}
          />

          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-4 border-blue-600 border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};