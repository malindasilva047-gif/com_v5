// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\home\SingleProduct.js
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { isWish, isWishReq, unWishReq } from "./Mixins";
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const SingleProduct = () => {
  const { data, dispatch } = useContext(HomeContext);
  const { products } = data;
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If no products in context, fetch all products directly
    if (!products || products.length === 0) {
      fetchAllProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${apiURL}/api/product/all-product`);
      if (res.data && res.data.Products) {
        dispatch({ type: "setProducts", payload: res.data.Products });
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (id, price, quantity, image) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let isPresent = cart.some((item) => item.id === id);

    if (!isPresent) {
      cart.push({ id, price, quantity: 1, image });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({ type: "cartProduct", payload: cart });
    }
  };

  if (loading) {
    return (
      <div className="col-span-full py-20 text-center font-black text-black text-lg">
        Loading Products...
      </div>
    );
  }

  return (
    <Fragment>
      {products && products.length > 0 ? (
        products.map((item, index) => {
          return (
            <div
              key={item._id || index}
              className="group bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-xl hover:border-orange-500 transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1 relative"
            >
              {/* Product Image */}
              <div className="relative w-full h-52 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                <img
                  onClick={() => history.push(`/products/${item._id}`)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  src={
                    item.pImages && item.pImages[0]
                      ? item.pImages[0].startsWith("http")
                        ? item.pImages[0]
                        : `${apiURL}/uploads/products/${item.pImages[0]}`
                      : "/placeholder.png"
                  }
                  alt={item.pName}
                />

                {item.pOffer > 0 && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.pOffer}% OFF
                  </span>
                )}

                <button
                  onClick={() =>
                    isWish(item._id, dispatch)
                      ? unWishReq(item._id, dispatch)
                      : isWishReq(item._id, dispatch)
                  }
                  className="absolute top-2 right-2 bg-white p-2 rounded-full text-black hover:text-orange-500 transition-all shadow-md transform hover:scale-110"
                >
                  <svg
                    className={`w-5 h-5 ${
                      isWish(item._id, dispatch) ? "text-orange-500 fill-current" : ""
                    }`}
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
                </button>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-xs font-extrabold text-black uppercase tracking-wider block mb-1">
                    {item.pCategory?.cName || "Uncategorized"}
                  </span>

                  <h3
                    onClick={() => history.push(`/products/${item._id}`)}
                    className="font-black text-black text-base line-clamp-1 hover:text-orange-500 cursor-pointer transition-colors"
                  >
                    {item.pName}
                  </h3>

                  <div className="flex items-center space-x-1 my-2">
                    <svg className="w-4 h-4 text-orange-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-bold text-black">
                      {item.pRatingsReviews && item.pRatingsReviews.length > 0
                        ? (
                            item.pRatingsReviews.reduce((acc, curr) => acc + Number(curr.rating), 0) /
                            item.pRatingsReviews.length
                          ).toFixed(1)
                        : "5.0"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-lg font-black text-black">
                    Rs. {item.pPrice}
                  </span>

                  <button
                    onClick={() =>
                      addToCart(
                        item._id,
                        item.pPrice,
                        item.pQuantity,
                        item.pImages ? item.pImages[0] : ""
                      )
                    }
                    className="bg-black hover:bg-orange-500 text-white font-bold px-3 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs uppercase font-extrabold">Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full py-16 text-center text-black font-extrabold text-lg bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          No products found.
        </div>
      )}
    </Fragment>
  );
};

export default SingleProduct;