export const ProductDescription = ({ product }) => (
  <div className="p-4">
    <h3 className="text-[20px] font-bold mb-4">Product Description</h3>
    <p className="text-gray-700">{product.description}</p>

    <h4 className="text-[20px] font-bold mt-6 mb-2">Product Specifications</h4>
    <ul className="list-decimal pl-5 text-gray-700">
      {product.specifications?.map((spec, index) => (
        <li key={index}>{spec}</li>
      ))}
    </ul>
  </div>
);