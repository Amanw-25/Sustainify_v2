import { FaShoppingCart, FaHeart } from "react-icons/fa";

export const BuySection = ({ product, cart, handleAddToCart, handleCheckout }) => {
  return (
    <div className="relative h-full">
      <div className="sticky top-10 p-6 border rounded-lg shadow-md bg-white min-h-[300px]">
        <h4 className="text-[20px] font-bold mb-4">Buy Now</h4>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-[24px] font-bold text-primaryColor">
            ₹{product.price}
          </h2>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className={`mt-6 w-full ${
            product.stock
              ? "bg-[#004d40] hover:bg-[#00695c]"
              : "bg-gray-400 cursor-not-allowed"
          } text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300`}
        >
          <FaShoppingCart size={20} />
          {product.stock ? "Add to Cart" : "Out of Stock"}
        </button>

        <button
          onClick={handleCheckout}
          disabled={!cart?.items?.length}
          className={`mt-6 w-full ${
            cart?.items?.length
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300`}
        >
          Buy Now
        </button>

        <button className="mt-3 w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors duration-300">
          <FaHeart className="text-red-500" size={20} />
          Add to Wishlist
        </button>

        <div className="mt-6">
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-[15px] text-red-600 font-bold mb-2">
              Only {product.stock} left
            </p>
          )}
          <p className="text-[15px] text-green-600 font-bold mb-2">
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
          <p className="text-[15px] text-gray-500">
            Carbon Footprint: {product.carbonFootprint} kg CO2
          </p>
        </div>
      </div>
    </div>
  );
};