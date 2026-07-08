// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\home\ProductCategoryDropdown.js
import React, { Fragment, useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import "./style.css";

const apiURL = process.env.REACT_APP_API_URL;

const CategoryList = () => {
  const history = useHistory();
  const [categories, setCategories] = useState(null);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkScrollState = () => {
    const el = scrollRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScrollState();
    window.addEventListener("resize", checkScrollState);
    return () => window.removeEventListener("resize", checkScrollState);
  }, [categories]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = direction === "left" ? -340 : 340;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group my-2">
      {/* Left Navigation Arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Previous Categories"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-xl transition-all duration-200 focus:outline-none ${
          canScrollLeft
            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-110 cursor-pointer opacity-100 shadow-orange-500/30"
            : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-40"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Single-Row Horizontal Category Slider with Pure #000000 Black Text */}
      <div
        ref={scrollRef}
        onScroll={checkScrollState}
        className="flex items-center space-x-6 overflow-x-auto scrollbar-none scroll-smooth py-4 px-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories && categories.length > 0 ? (
          categories.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => history.push(`/products/category/${item._id}`)}
                className="flex-shrink-0 w-44 md:w-52 flex flex-col items-center justify-center p-5 rounded-2xl bg-white border-2 border-gray-200 hover:border-orange-500 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group/card"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 group-hover/card:scale-110 transition-transform duration-300 shadow-sm">
                  <img
                    className="w-full h-full object-cover rounded-full bg-gray-100"
                    src={`${apiURL}/uploads/categories/${item.cImage}`}
                    alt={item.cName}
                  />
                </div>
                {/* Text explicitly set to Pure Black (#000000) */}
                <div className="font-black text-sm md:text-base text-[#000000] mt-4 text-center truncate w-full tracking-wide">
                  {item.cName}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm font-extrabold text-[#000000] text-center w-full my-4">
            No Categories Available
          </div>
        )}
      </div>

      {/* Right Navigation Arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="Next Categories"
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full shadow-xl transition-all duration-200 focus:outline-none ${
          canScrollRight
            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-110 cursor-pointer opacity-100 shadow-orange-500/30"
            : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-40"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

const FilterList = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [range, setRange] = useState(0);

  const rangeHandle = (e) => {
    setRange(e.target.value);
    fetchData(e.target.value);
  };

  const fetchData = async (price) => {
    if (price === "all") {
      try {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch({ type: "loading", payload: true });
      try {
        setTimeout(async () => {
          let responseData = await productByPrice(price);
          if (responseData && responseData.Products) {
            dispatch({ type: "setProducts", payload: responseData.Products });
            dispatch({ type: "loading", payload: false });
          }
        }, 700);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeFilterBar = () => {
    fetchData("all");
    dispatch({ type: "filterListDropdown", payload: !data.filterListDropdown });
    setRange(0);
  };

  return (
    <div className={`${data.filterListDropdown ? "" : "hidden"} my-4 p-4 rounded-xl bg-gray-900 border border-orange-500/30`}>
      <div className="w-full flex flex-col">
        <div className="font-semibold text-white py-2">Filter by price</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2 w-2/3 lg:w-2/4">
            <label htmlFor="points" className="text-sm text-gray-300">
              Price (between 0 and 1000$):{" "}
              <span className="font-bold text-orange-400">{range}.00$</span>{" "}
            </label>
            <input
              value={range}
              className="slider accent-orange-500"
              type="range"
              id="points"
              min="0"
              max="1000"
              step="10"
              onChange={(e) => rangeHandle(e)}
            />
          </div>
          <div onClick={() => closeFilterBar()} className="cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full p-1 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  const searchHandle = (e) => {
    setSearch(e.target.value);
    fetchData();
    dispatch({
      type: "searchHandleInReducer",
      payload: e.target.value,
      productArray: productArray,
    });
  };

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          setPa(responseData.Products);
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  const closeSearchBar = () => {
    dispatch({ type: "searchDropdown", payload: !data.searchDropdown });
    fetchData();
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  return (
    <div className={`${data.searchDropdown ? "" : "hidden"} my-4 flex items-center justify-between p-2 rounded-xl bg-gray-900 border border-orange-500/30`}>
      <input
        value={search}
        onChange={(e) => searchHandle(e)}
        className="px-4 text-lg py-2 focus:outline-none w-full bg-transparent text-white placeholder-gray-500"
        type="text"
        placeholder="Search products..."
      />
      <div onClick={() => closeSearchBar()} className="cursor-pointer ml-2">
        <svg
          className="w-8 h-8 text-gray-300 hover:text-white hover:bg-gray-800 rounded-full p-1 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <FilterList />
      <Search />
    </Fragment>
  );
};

export default ProductCategoryDropdown;