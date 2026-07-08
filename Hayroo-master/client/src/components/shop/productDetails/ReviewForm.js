import React, { Fragment, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Alert, reviewSubmitHanlder } from "./Action";
import { LayoutContext } from "../layout";
import { isAuthenticate } from "../auth/fetchApi";
import { getSingleProduct } from "./FetchApi";

const ReviewForm = (props) => {
  const { data, dispatch } = useContext(LayoutContext);
  let { id } = useParams(); // Product Id

  const [fData, setFdata] = useState({
    rating: 0,
    review: "",
    error: false,
    success: false,
    pId: id,
  });

  const [hoverRating, setHoverRating] = useState(0);

  if (fData.error || fData.success) {
    setTimeout(() => {
      setFdata({ ...fData, error: false, success: false });
    }, 3000);
  }

  const fetchData = async () => {
    try {
      let responseData = await getSingleProduct(id);
      if (responseData.Product) {
        dispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
      }
      if (responseData.error) {
        console.log(responseData.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ratingUserList = data.singleProductDetail?.pRatingsReviews
    ? data.singleProductDetail.pRatingsReviews.map((item) =>
        item.user ? item.user._id : ""
      )
    : [];

  const currentUser = isAuthenticate() ? isAuthenticate().user : null;

  return (
    <Fragment>
      <div className="md:mx-16 lg:mx-20 xl:mx-24 flex flex-col my-2">
        {fData.error ? Alert("red", fData.error) : ""}
        {fData.success ? Alert("green", fData.success) : ""}
      </div>

      {currentUser && ratingUserList.includes(currentUser._id) ? (
        <div className="mb-12 md:mx-16 lg:mx-20 xl:mx-24 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl text-center text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-700">
          ✓ You have already submitted a review for this product.
        </div>
      ) : (
        <div className="mb-12 md:mx-16 lg:mx-20 xl:mx-24 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              Write a Review
            </span>
            <span className="text-gray-500 text-sm">
              Your feedback helps others make better choices.
            </span>
          </div>

          {/* Dynamic Interactive Star Rating */}
          <div className="flex items-center space-x-2 my-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">Your Rating:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="focus:outline-none transition-transform duration-150 hover:scale-125"
                  onClick={() => setFdata({ ...fData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <svg
                    className={`w-8 h-8 ${
                      star <= (hoverRating || fData.rating)
                        ? "text-amber-400 fill-current"
                        : "text-gray-300 dark:text-gray-700"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Review Text Area */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="textArea" className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              onChange={(e) => setFdata({ ...fData, review: e.target.value })}
              value={fData.review}
              className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white"
              name="textArea"
              id="textArea"
              rows={4}
              placeholder="What did you like or dislike about this product?"
            />
          </div>

          <div>
            <button
              onClick={() => reviewSubmitHanlder(fData, setFdata, fetchData)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ReviewForm;