// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\productDetails\ProductDetailsSection.js
import React, { Fragment, useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom"; // Updated for React Router v5
import { ProductDetailsContext } from "./index";
import { LayoutContext } from "../layout";
import Submenu from "./Submenu";
import ProductDetailsSectionTwo from "./ProductDetailsSectionTwo";

import { getSingleProduct } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";

import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { slideImage, cartList } from "./Mixins";

// Safe fallback for process.env in Webpack 5 / modern bundlers
const apiURL = (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) 
  ? process.env.REACT_APP_API_URL 
  : "";

const ProductDetailsSection = () => {
  let { id } = useParams();
  const history = useHistory(); // Replaced useNavigate with useHistory

  const { data, dispatch } = useContext(ProductDetailsContext);
  const { data: layoutData, dispatch: layoutDispatch } = useContext(LayoutContext);

  const sProduct = layoutData?.singleProductDetail;
  const [pImages, setPimages] = useState([]);
  const [count, setCount] = useState(0); 
  const [quantity, setQuantity] = useState(1); 
  const [wList, setWlist] = useState([]); 

  useEffect(() => {
    try {
      const storedWish = JSON.parse(localStorage.getItem("wishList"));
      setWlist(Array.isArray(storedWish) ? storedWish : []);
    } catch (e) {
      setWlist([]);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      if (responseData && responseData.Product) {
        layoutDispatch({
          type: "singleProductDetail",
          payload: responseData.Product,
        });
        setPimages(responseData.Product.pImages || []);
        layoutDispatch({ type: "inCart", payload: cartList() });
      }
    } catch (error) {
      console.error("Error fetching single product:", error);
    } finally {
      dispatch({ type: "loading", payload: false });
    }

    await fetchCartProduct();
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products });
      }
    } catch (error) {
      console.error("Error fetching cart products:", error);
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.png";
    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }
    return `${apiURL}/uploads/products/${imageName}`;
  };

  const handleAddToCart = () => {
    if (!sProduct) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = cart.findIndex((item) => item.id === sProduct._id);

    if (index !== -1) {
      cart[index].quantitiy = quantity;
    } else {
      cart.push({
        id: sProduct._id,
        quantitiy: quantity,
        price: sProduct.pPrice,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    const inCartIds = cart.map((item) => item.id);
    layoutDispatch({ type: "inCart", payload: inCartIds });
    layoutDispatch({ type: "cartTotalCost", payload: true });
    
    fetchCartProduct();
  };

  if (data?.loading || !sProduct) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }

  const mainImage = sProduct.pImages?.[count] || sProduct.pImages?.[0] || "";
  const subTotal = (sProduct.pPrice || 0) * quantity;
  const isInCart = Array.isArray(layoutData?.inCart) && layoutData.inCart.includes(sProduct._id);

  return (
    <Fragment>
      <Submenu
        value={{
          categoryId: sProduct.pCategory?._id || "",
          product: sProduct.pName || "",
          category: sProduct.pCategory?.cName || "Category",
        }}
      />
      
      <section className="m-4 md:mx-12 md:my-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Thumbnails Gallery */}
          <div className="hidden md:flex md:col-span-1 flex-col space-y-3">
            {sProduct.pImages &&
              sProduct.pImages.map((img, idx) => (
                <img
                  key={idx}
                  onClick={() => slideImage("increase", idx, count, setCount, pImages)}
                  className={`${
                    count === idx ? "border-yellow-600 border-2 shadow-md opacity-100" : "opacity-60 hover:opacity-100 border-gray-200"
                  } cursor-pointer w-20 h-20 object-contain object-center border rounded-lg bg-gray-50 transition`}
                  src={getImageUrl(img)}
                  alt="thumbnail"
                />
              ))}
          </div>

          {/* Main Display Image */}
          <div className="col-span-1 md:col-span-6">
            <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-white p-4 h-[420px] flex items-center justify-center">
              <img
                className="max-h-full max-w-full object-contain"
                src={getImageUrl(mainImage)}
                alt={sProduct.pName || "Product"}
              />
              {pImages.length > 1 && (
                <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
                  <button
                    onClick={() => slideImage("decrease", null, count, setCount, pImages)}
                    className="pointer-events-auto p-2 rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => slideImage("increase", null, count, setCount, pImages)}
                    className="pointer-events-auto p-2 rounded-full bg-white/80 text-gray-800 shadow-md hover:bg-white transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="col-span-1 md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug">
                  {sProduct.pName}
                </h1>
                
                <button className="p-2 rounded-full hover:bg-gray-100 transition">
                  <svg
                    onClick={(e) => isWishReq(e, sProduct._id, setWlist)}
                    className={`${
                      isWish(sProduct._id, wList) && "hidden"
                    } w-6 h-6 cursor-pointer text-gray-400 hover:text-red-500`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <svg
                    onClick={(e) => unWishReq(e, sProduct._id, setWlist)}
                    className={`${
                      !isWish(sProduct._id, wList) && "hidden"
                    } w-6 h-6 cursor-pointer text-red-500`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Dynamic Subtotal Price */}
              <div className="my-4 border-y border-gray-100 py-3">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-yellow-700">
                    LKR {subTotal.toLocaleString("en-LK")}.00
                  </span>
                  {quantity > 1 && (
                    <span className="text-sm font-medium text-gray-500">
                      (LKR {sProduct.pPrice?.toLocaleString("en-LK")} × {quantity})
                    </span>
                  )}
                </div>
              </div>

              <p className="my-4 text-sm text-gray-600 leading-relaxed">
                {sProduct.pDescription}
              </p>

              {/* Quantity Selector */}
              <div className="my-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                    Quantity
                  </span>
                  {sProduct.pQuantity > 0 ? (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock: {sProduct.pQuantity}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50">
                    <button
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="px-3.5 py-1.5 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-l-lg disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-gray-800">
                      {quantity}
                    </span>
                    <button
                      disabled={quantity >= sProduct.pQuantity}
                      onClick={() => setQuantity((prev) => Math.min(sProduct.pQuantity, prev + 1))}
                      className="px-3.5 py-1.5 text-lg font-bold text-gray-600 hover:bg-gray-200 rounded-r-lg disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {sProduct.pQuantity > 0 ? (
                <Fragment>
                  {isInCart ? (
                    <button
                      disabled
                      className="w-full rounded-lg bg-gray-400 py-3 font-bold text-white uppercase text-sm tracking-wider cursor-not-allowed"
                    >
                      ✓ In Cart
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="w-full rounded-lg bg-yellow-600 hover:bg-yellow-700 py-3 font-bold text-white uppercase text-sm tracking-wider transition active:scale-[0.98]"
                    >
                      Add to Cart
                    </button>
                  )}

                  <button
                    onClick={() => {
                      handleAddToCart();
                      history.push("/checkout"); // Updated to use history.push
                    }}
                    className="w-full rounded-lg bg-gray-900 hover:bg-black py-3 font-bold text-white uppercase text-sm tracking-wider transition active:scale-[0.98]"
                  >
                    Buy Now
                  </button>
                </Fragment>
              ) : (
                <button
                  disabled
                  className="col-span-2 w-full rounded-lg bg-gray-300 py-3 font-bold text-gray-500 uppercase text-sm tracking-wider cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      <ProductDetailsSectionTwo />
    </Fragment>
  );
};

export default ProductDetailsSection;