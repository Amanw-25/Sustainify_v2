const parseArrayData = (data) => {
  if (!data || data.length === 0) return [];

  try {
    if (typeof data[0] === 'string' && !data[0].startsWith('[')) {
      return data;
    }
    return JSON.parse(data[0]);
  } catch (error) {
    console.error("Error parsing data:", error);
    return [];
  }
};

export const ProductDescription = ({ product }) => {
  const specifications = parseArrayData(product.specifications);
  const formatSpecification = (spec) => {
    if (!spec) return "";
    const words = spec.split(" ");
    const firstWord = words[0];
    const restOfText = words.slice(1).join(" ");
    return (
      <span>
        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{firstWord}</span>
        {restOfText ? ` ${restOfText}` : ""}
      </span>
    );
  };

  return (
    <div className="p-4">
      <h3 className="text-[20px] font-bold mb-4">Product Description</h3>
      <p className="text-gray-700">{product.description}</p>

      <h4 className="text-[20px] font-bold mt-6 mb-2">Product Specifications</h4>
      <ul className="list-decimal pl-5 text-gray-700">
        {specifications?.map((spec, index) => (
          <li key={index}>{formatSpecification(spec)}</li>
        ))}
      </ul>
    </div>
  );
};