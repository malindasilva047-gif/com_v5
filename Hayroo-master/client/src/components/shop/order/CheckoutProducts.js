import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { createOrder, getPayHereHash } from "./FetchApi";
import { fetchData } from "./Action";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [state, setState] = useState({
    address: "",
    phone: "",
    error: false,
    success: false,
  });

  useEffect(() => {
    fetchData(cartListProduct, dispatch);

    // Bind PayHere Payment Event Handlers
    if (window.payhere) {
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);
        
        // Save Order to Database after successful payment
        const jwt = JSON.parse(localStorage.getItem("jwt"));
        const orderData = {
          allProduct: data.cartProduct,
          user: jwt ? jwt.user._id : null,
          amount: totalCost(),
          transactionId: orderId,
          address: state.address,
          phone: state.phone,
        };

        createOrder(orderData).then((res) => {
          localStorage.removeItem("cart");
          dispatch({ type: "cartProduct", payload: null });
          history.push("/user/orders");
        });
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
      };

      window.payhere.onError = function onError(error) {
        console.log("Error:" + error);
        setState({ ...state, error: "Payment failed. Please try again." });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.address, state.phone]);

  const handlePayHerePayment = async () => {
    if (!state.address || !state.phone) {
      setState({ ...state, error: "Please provide both delivery address and phone number." });
      return;
    }

    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const user = jwt ? jwt.user : {};
    const orderId = "ORD_" + new Date().getTime();

    // Prepare Payment Data for PayHere
    const paymentReq = {
      order_id: orderId,
      items: "Order Checkout",
      amount: totalCost(),
      currency: "LKR",
      first_name: user.name || "Customer",
      last_name: "",
      email: user.email || "customer@example.com",
      phone: state.phone,
      address: state.address,
      city: "Colombo",
      country: "Sri Lanka",
    };

    // Get Merchant ID & Hash from backend API
    const hashRes = await getPayHereHash(paymentReq);

    if (hashRes && hashRes.hash) {
      const payment = {
        sandbox: true, // Live go-live වෙද්දි false කරන්න
        merchant_id: hashRes.merchant_id,
        return_url: undefined,
        cancel_url: undefined,
        notify_url: `${apiURL}/api/payhere/notify`,
        order_id: orderId,
        items: "Order Checkout",
        amount: totalCost(),
        currency: "LKR",
        hash: hashRes.hash,
        first_name: user.name || "Customer",
        last_name: "",
        email: user.email || "customer@example.com",
        phone: state.phone,
        address: state.address,
        city: "Colombo",
        country: "Sri Lanka",
      };

      window.payhere.startPayment(payment);
    } else {
      setState({ ...state, error: "Failed to initialize payment hash from server." });
    }
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Please wait...
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Order</div>
        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          <div className="md:w-1/2">
            <CheckoutProducts products={data.cartProduct} />
          </div>
          <div className="w-full order-first md:order-last md:w-1/2">
            <div className="p-4 md:p-8">
              {state.error && (
                <div className="bg-red-200 text-red-700 py-2 px-4 rounded mb-4">
                  {state.error}
                </div>
              )}
              <div className="flex flex-col py-2">
                <label htmlFor="address" className="pb-2">
                  Delivery Address
                </label>
                <input
                  value={state.address}
                  onChange={(e) =>
                    setState({
                      ...state,
                      address: e.target.value,
                      error: false,
                    })
                  }
                  type="text"
                  id="address"
                  className="border px-4 py-2"
                  placeholder="Address..."
                />
              </div>
              <div className="flex flex-col py-2 mb-4">
                <label htmlFor="phone" className="pb-2">
                  Phone
                </label>
                <input
                  value={state.phone}
                  onChange={(e) =>
                    setState({
                      ...state,
                      phone: e.target.value,
                      error: false,
                    })
                  }
                  type="text"
                  id="phone"
                  className="border px-4 py-2"
                  placeholder="+94..."
                />
              </div>
              
              <div className="text-xl font-bold py-2">
                Total: LKR {totalCost()}.00
              </div>

              <div
                onClick={handlePayHerePayment}
                className="w-full px-4 py-3 text-center text-white font-semibold cursor-pointer rounded mt-4"
                style={{ background: "#303031" }}
              >
                Pay with PayHere
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  return (
    <Fragment>
      <div className="grid grid-cols-2 md:grid-cols-1">
        {products !== null && products.length > 0 ? (
          products.map((product, index) => {
            return (
              <div
                key={index}
                className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between"
              >
                <div className="md:flex md:items-center md:space-x-4">
                  <img
                    onClick={(e) => history.push(`/products/${product._id}`)}
                    className="cursor-pointer md:h-20 md:w-20 object-cover object-center"
                    src={`${apiURL}/uploads/products/${product.pImages[0]}`}
                    alt="wishListproduct"
                  />
                  <div className="text-lg md:ml-6 truncate">
                    {product.pName}
                  </div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    Price : LKR {product.pPrice}.00{" "}
                  </div>
                  <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                    Quantity : {quantity(product._id)}
                  </div>
                  <div className="font-semibold text-gray-600 text-sm">
                    Subtotal : LKR {subTotal(product._id, product.pPrice)}.00
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>No product found for checkout</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;