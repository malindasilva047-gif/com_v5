import React, { Fragment, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "./Action";

import moment from "moment";
import { LayoutContext } from "../layout";
import { deleteReview } from "./Action";
import { isAuthenticate } from "../auth/fetchApi";
import { getSingleProduct } from "./FetchApi";

const AllReviews = (props) => {
  const { data, dispatch } = useContext(LayoutContext);
  const { pRatingsReviews } = data.singleProductDetail;
  let { id } = useParams(); // Product Id

  const [fData, setFdata] = useState({
    success: false,
  });

  if (fData.success) {
    setTimeout(() => {
      setFdata({ ...fData, success: false });
    }, 2000);
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

  return (
    <Fragment>
      <div className="md:mx-16 lg:mx-20 xl:mx-24 flex flex-col">
        {fData.success ? Alert("red", fData.success) : ""}
      </div>
      <div className="mt-6 mb-12 md:mx-16 lg:mx-20 xl:mx-24 space-y-4">
        {pRatingsReviews && pRatingsReviews.length > 0 ? (
          pRatingsReviews.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row gap-4 items-start"
              >
                {/* User Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {item.user?.name ? item.user.name.charAt(0).toUpperCase() : "U"}
                </div>

                {/* Review Content */}
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 dark:text-white text-base">
                          {item.user ? item.user.name : "Anonymous"}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✓ Verified Buyer
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {moment(item.createdAt).format("MMM DD, YYYY")}
                      </span>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Number(item.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-200 dark:text-gray-700"
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {item.review}
                  </p>

                  {/* Delete Option for Author */}
                  {item.user &&
                  isAuthenticate() &&
                  item.user._id === isAuthenticate().user._id && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() =>
                          deleteReview(
                            item._id,
                            data.singleProductDetail._id,
                            fetchData,
                            setFdata
                          )
                        }
                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl text-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700">
            No customer reviews yet. Be the first to review this product!
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default AllReviews;