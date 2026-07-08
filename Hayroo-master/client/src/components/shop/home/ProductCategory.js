import React, { Fragment, useContext } from "react";
import ProductCategoryDropdown from "./ProductCategoryDropdown";
import { HomeContext } from "./index";

const ProductCategory = (props) => {
  const { data, dispatch } = useContext(HomeContext);

  return (
    <Fragment>
      <div className="flex justify-between items-center mb-4">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 tracking-wide uppercase">
          Categories
        </h2>

        {/* Filter and Search Actions */}
        <div className="flex items-center space-x-4 text-gray-700 text-sm md:text-base font-semibold">
          <div
            onClick={() =>
              dispatch({
                type: "filterListDropdown",
                payload: !data.filterListDropdown,
              })
            }
            className={`flex items-center space-x-1 cursor-pointer select-none hover:text-orange-600 transition-colors ${
              data.filterListDropdown ? "text-orange-600 font-bold" : ""
            }`}
          >
            <span>Filter</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>

          <span className="text-gray-300">|</span>

          <div
            onClick={() =>
              dispatch({
                type: "searchDropdown",
                payload: !data.searchDropdown,
              })
            }
            className={`flex items-center space-x-1 cursor-pointer select-none hover:text-orange-600 transition-colors ${
              data.searchDropdown ? "text-orange-600 font-bold" : ""
            }`}
          >
            <span>Search</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <ProductCategoryDropdown />
    </Fragment>
  );
};

export default ProductCategory;