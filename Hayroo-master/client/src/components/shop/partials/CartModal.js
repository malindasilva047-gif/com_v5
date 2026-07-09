// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\partials\CartModal.js
import React, { Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../index";
import { cartListProduct } from "./FetchApi";
import { isAuthenticate } from "../auth/fetchApi";
import { cartList } from "../productDetails/Mixins";
import { subTotal, quantity, totalCost } from "./Mixins";

const apiURL = process.env.REACT_APP_API_URL || "";

const CartModal = () => {
  const history = useHistory();

  const { data, dispatch } = useContext(LayoutContext);
  const products = data.cartProduct;

  const cartModalOpen = () =>
    dispatch({ type: "cartModalToggle", payload: !data.cartModal });

  const fetchData = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "cartTotalCost", payload: totalCost() });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data.cartModal) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.cartModal]);

  const removeCartProduct = (id) => {
    let cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    if (cart.length !== 0) {
      cart = cart.filter((item) => item.id !== id && item._id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
      dispatch({ type: "cartTotalCost", payload: totalCost() });
    }
    if (cart.length === 0) {
      dispatch({ type: "cartProduct", payload: null });
      dispatch({ type: "cartTotalCost", payload: 0 });
      fetchData();
      dispatch({ type: "inCart", payload: cartList() });
    }
  };

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.png";
    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }
    return `${apiURL}/uploads/products/${imageName}`;
  };

  const calculatedTotal = totalCost();

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={cartModalOpen}
        className={`${
          !data.cartModal ? "hidden" : ""
        } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50 cursor-pointer`}
      />
      
      {/* Cart Modal Start */}
      <section
        className={`${
          !data.cartModal ? "hidden" : ""
        } fixed z-40 inset-0 flex items-start justify-end pointer-events-none`}
      >
        <div
          style={{ background: "#303031" }}
          className="w-full md:w-5/12 lg:w-4/12 h-full flex flex-col justify-between pointer-events-auto shadow-2xl"
        >
          <div className="overflow-y-auto">
            <div className="border-b border-gray-700 flex justify-between items-center p-4">
              <div className="text-white text-lg font-semibold">Your Cart</div>
              {/* Cart Modal Close Button */}
              <div className="text-white">
                <svg
                  onClick={cartModalOpen}
                  className="w-6 h-6 cursor-pointer hover:text-red-400 transition"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="m-4 flex-col divide-y divide-gray-700">
              {products && products.length > 0 ? (
                products.map((item, index) => {
                  const itemQty = quantity(item._id);
                  const itemSubTotal = subTotal(item._id, item.pPrice);

                  return (
                    <div key={index} className="text-white flex space-x-3 py-4 items-center">
                      <img
                        className="w-16 h-16 object-cover object-center rounded border border-gray-600 flex-shrink-0"
                        src={getImageUrl(item.pImages?.[0])}
                        alt="cartProduct"
                      />
                      <div className="relative w-full flex flex-col justify-between pr-6">
                        <div className="text-sm font-medium pr-2 line-clamp-1">{item.pName}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-400">
                            Qty: <span className="text-gray-200 font-bold">{itemQty}</span>
                          </div>
                          <div className="text-xs text-gray-300">
                            Subtotal: <span className="font-bold text-yellow-400">LKR {itemSubTotal}.00</span>
                          </div>
                        </div>
                        {/* Remove Button */}
                        <div
                          onClick={() => removeCartProduct(item._id)}
                          className="absolute top-0 right-0 text-gray-400 hover:text-red-500 cursor-pointer transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="m-4 py-8 text-white text-center text-gray-400">
                  Your cart is empty.
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-gray-900 border-t border-gray-800 space-y-3">
            <div
              onClick={() => {
                cartModalOpen();
                history.push("/");
              }}
              className="w-full py-2.5 border border-gray-600 hover:border-gray-400 text-white text-center cursor-pointer rounded transition text-sm font-semibold"
            >
              Continue Shopping
            </div>

            {products && products.length > 0 ? (
              isAuthenticate() ? (
                <div
                  className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-center cursor-pointer rounded transition text-sm tracking-wide shadow-lg"
                  onClick={() => {
                    cartModalOpen();
                    history.push("/checkout");
                  }}
                >
                  Checkout - LKR {calculatedTotal}.00
                </div>
              ) : (
                <div
                  className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-center cursor-pointer rounded transition text-sm tracking-wide shadow-lg"
                  onClick={() => {
                    cartModalOpen();
                    dispatch({
                      type: "loginSignupError",
                      payload: !data.loginSignupError,
                    });
                    dispatch({
                      type: "loginSignupModalToggle",
                      payload: !data.loginSignupModal,
                    });
                  }}
                >
                  Login to Checkout - LKR {calculatedTotal}.00
                </div>
              )
            ) : (
              <div className="w-full py-3 bg-gray-800 text-gray-500 text-center cursor-not-allowed rounded text-sm font-semibold">
                Checkout Empty
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Cart Modal End */}
    </Fragment>
  );
};

export default CartModal;