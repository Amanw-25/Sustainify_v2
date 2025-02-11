import React, { useRef, useState } from 'react';

export const ProductImages = ({ images, mainImage, setMainImage, handleImageZoom, zoomPosition,handleMouseEnter, handleMouseLeave }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const imageContainerRef = useRef(null);
  const zoomRef = useRef(null);
  
  return (
    <div className="md:col-span-2 flex gap-5">
      <div className="flex flex-col gap-3">
        {images.slice(0, 3).map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image.url}
              alt={`Product thumbnail ${index + 1}`}
              onClick={() => setMainImage(image.url)}
              className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-all duration-300 hover:opacity-90 
                ${mainImage === image.url ? "border-2 border-blue-600 shadow-lg" : "border border-gray-200"}`}
            />
            {mainImage === image.url && (
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
            src={mainImage || (images[0] && images[0].url)}
            alt="Main product"
            onLoad={() => setImageLoading(false)}
            className="w-full h-full object-cover"
          />

          <div
            ref={zoomRef}
            className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none transition-opacity duration-200"
            style={{
              backgroundImage: `url(${mainImage || (images[0] && images[0].url)})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
            }}
          />

          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};