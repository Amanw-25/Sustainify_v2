import { FaStar} from "react-icons/fa";

export const ProductInfo = ({ product }) => {
  return (
    <div>
      <h3 className="text-headingColor text-[22px] leading-9 mt-3 font-bold">
        {product.name}
      </h3>
      <div className="flex items-center gap-[6px]">
        <span className="flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor">
          <FaStar className="text-yellow-500" />
          {product.averageRating?.toFixed(1)}
        </span>
        <span className="text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
          ({product.reviews?.length || 0} Reviews)
        </span>
      </div>
      <p className="text__para text-[14px] leading-6 md:text-[15px] lg:max-w-[390px] mb-3 mt-3">
        {product.shortdescription}
      </p>
      <span className="bg-[#ccf0f3] text-irisBlueColor py-2 px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded-full inline-block mt-1 sm:mt-1">
  {product.category}
</span>
    </div>
  );
};
