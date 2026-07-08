import React, { Fragment, useContext } from "react";
import ProductCategoryDropdown from "./ProductCategoryDropdown";
import { HomeContext } from "./index";

const ProductCategory = (props) => {
  const { data, dispatch } = useContext(HomeContext);

  return (
    <Fragment>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase flex items-center gap-2">
          <span className="w-2 h-7 bg-orange-600 rounded-full inline-block"></span>
          Categories
        </h2>

        {/* Filter and Search Actions */}
        <div className="flex items-center space-x-3 text-gray-900 dark:text-gray-100 font-extrabold text-sm md:text-base">
          <div
            onClick={() =>
              dispatch({
                type: "filterListDropdown",
                payload: !data.filterListDropdown,
              })
            }
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer select-none border transition-all duration-300 ${
              data.filterListDropdown
                ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/30 scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span className="font-bold tracking-wide">Filter</span>
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>

          <div
            onClick={() =>
              dispatch({
                type: "searchDropdown",
                payload: !data.searchDropdown,
              })
            }
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl cursor-pointer select-none border transition-all duration-300 ${
              data.searchDropdown
                ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-500/30 scale-105"
                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <span className="font-bold tracking-wide">Search</span>
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <ProductCategoryDropdown />
    </Fragment>
  );
};

export default ProductCategory;