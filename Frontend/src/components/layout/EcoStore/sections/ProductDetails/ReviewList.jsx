import { FaStar} from "react-icons/fa";

export const ReviewsList = ({ reviews }) => (
  <div>
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div
          key={review._id}
          className="mb-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-start gap-4 mb-2">
            <img
              src={review.userId?.profilePhoto}
              alt={review.userId?.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold">
                {review.userId?.name || "Anonymous"}
              </h4>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span className="font-semibold">{review.rating} / 5</span>
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
);
