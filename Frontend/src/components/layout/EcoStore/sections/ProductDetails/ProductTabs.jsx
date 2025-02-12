import { ProductDescription } from "./ProductDescription";
import { ReviewsList } from './ReviewList';
import  ReviewForm  from './ProductReviewForm';  // Add this import

export const ProductTabs = ({ tab, setTab, product, reviews, setReviews }) => {
  const handleReviewAdded = (newReview) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  return (
    <>
      <div className="mt-[50px] border-b border-solid border-[#0066ff34]">
        <button
          onClick={() => setTab("details")}
          className={`${
            tab === "details" && "border-b border-solid border-primaryColor"
          } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
        >
          Product Details
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`${
            tab === "reviews" && "border-b border-solid border-primaryColor"
          } py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
        >
          Reviews
        </button>
      </div>

      <div className="mt-[50px]">
        {tab === "details" ? (
          <ProductDescription product={product} />
        ) : (
          <div className="space-y-8">
            <ReviewForm 
              productId={product._id} 
              onReviewAdded={handleReviewAdded}
            />
            <ReviewsList reviews={reviews} />
          </div>
        )}
      </div>
    </>
  );
};