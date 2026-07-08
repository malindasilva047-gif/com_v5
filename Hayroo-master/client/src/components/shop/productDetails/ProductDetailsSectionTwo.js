import React, { Fragment, useContext, useEffect, useState } from "react";
import AllReviews from "./AllReviews";
import ReviewForm from "./ReviewForm";

import { ProductDetailsContext } from "./";
import { LayoutContext } from "../layout";
import { isAuthenticate } from "../auth/fetchApi";

const Menu = () => {
  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData } = useContext(LayoutContext);

  const reviewCount = layoutData.singleProductDetail?.pRatingsReviews?.length || 0;

  return (
    <Fragment>
      <div className="flex items-center justify-center border-b border-gray-200 dark:border-gray-800 mb-6 space-x-8">
        <button
          onClick={() => dispatch({ type: "menu", payload: true })}
          className={`pb-3 font-extrabold text-sm md:text-base transition-all ${
            data.menu
              ? "border-b-2 border-orange-600 text-orange-600"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => dispatch({ type: "menu", payload: false })}
          className={`pb-3 font-extrabold text-sm md:text-base transition-all relative flex items-center gap-2 ${
            !data.menu
              ? "border-b-2 border-orange-600 text-orange-600"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
          }`}
        >
          <span>Reviews</span>
          <span className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full">
            {reviewCount}
          </span>
        </button>
      </div>
    </Fragment>
  );
};

const RatingReview = () => {
  return (
    <Fragment>
      <AllReviews />
      {isAuthenticate() ? (
        <ReviewForm />
      ) : (
        <div className="mb-12 md:mx-16 lg:mx-20 xl:mx-24 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl text-amber-800 dark:text-amber-200 text-center font-semibold">
          🔒 You need to log in to leave a product review.
        </div>
      )}
    </Fragment>
  );
};

const ProductDetailsSectionTwo = (props) => {
  const { data } = useContext(ProductDetailsContext);
  const { data: layoutData } = useContext(LayoutContext);
  const [singleProduct, setSingleproduct] = useState({});

  useEffect(() => {
    setSingleproduct(
      layoutData.singleProductDetail ? layoutData.singleProductDetail : {}
    );
  }, [layoutData.singleProductDetail]);

  return (
    <Fragment>
      <section className="m-4 md:mx-12 md:my-8">
        <Menu />
        {data.menu ? (
          <div className="mt-6 md:mx-16 lg:mx-20 xl:mx-24 leading-relaxed text-gray-700 dark:text-gray-300 text-base bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            {singleProduct.pDescription}
          </div>
        ) : (
          <RatingReview />
        )}
      </section>
      <div className="m-4 md:mx-12 md:my-6 flex justify-center uppercase font-bold tracking-wider bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl">
        <div className="flex items-center gap-2 text-sm">
          <span>Category:</span>
          <span className="text-orange-600 font-extrabold">
            {singleProduct.pCategory ? singleProduct.pCategory.cName : "N/A"}
          </span>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductDetailsSectionTwo;