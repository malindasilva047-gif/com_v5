// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\order\CheckoutProducts.js
import React, { Fragment, useEffect, useContext, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { createOrder, getPayHereHash } from "./FetchApi";
import { fetchData } from "./Action";

const apiURL = process.env.REACT_APP_API_URL || "";

export const CheckoutComponent = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate live total based on fetched products array and local quantities
  const calculateCartTotal = () => {
    let total = 0;
    const products = data?.cartProduct || [];
    products.forEach((product) => {
      const qty = quantity(product._id);
      const price = parseFloat(product.pPrice || product.price || 0);
      if (!isNaN(qty) && !isNaN(price)) {
        total += qty * price;
      }
    });
    return total;
  };

  const calculatedTotal = calculateCartTotal();

  const addressRef = useRef(address);
  const phoneRef = useRef(phone);
  const totalRef = useRef(calculatedTotal);

  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  useEffect(() => {
    phoneRef.current = phone;
  }, [phone]);

  useEffect(() => {
    totalRef.current = calculatedTotal;
  }, [calculatedTotal]);

  // Initial Data Load (Runs ONLY ONCE on mount)
  useEffect(() => {
    fetchData(cartListProduct, dispatch);

    // Bind PayHere Payment Event Handlers
    if (window.payhere) {
      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);

        const jwt = JSON.parse(localStorage.getItem("jwt"));
        const orderData = {
          allProduct: data?.cartProduct || [],
          user: jwt ? jwt.user._id : null,
          amount: totalRef.current,
          transactionId: orderId,
          address: addressRef.current,
          phone: phoneRef.current,
        };

        createOrder(orderData)
          .then(() => {
            localStorage.removeItem("cart");
            dispatch({ type: "cartProduct", payload: null });
            dispatch({ type: "inCart", payload: null });
            history.push("/user/orders");
          })
          .catch((err) => {
            console.error("Order creation error:", err);
            setError("Failed to record order. Please contact support.");
          });
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
        setIsProcessing(false);
      };

      window.payhere.onError = function onError(err) {
        console.log("PayHere Error:", err);
        setError("Payment failed. Please try again.");
        setIsProcessing(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePayHerePayment = async (e) => {
    if (e) e.preventDefault();

    if (!address.trim() || !phone.trim()) {
      setError("Please provide both delivery address and phone number.");
      return;
    }

    if (calculatedTotal <= 0) {
      setError("Your cart total is invalid or empty.");
      return;
    }

    setError(false);
    setIsProcessing(true);

    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const user = jwt ? jwt.user : {};
    const orderId = "ORD_" + new Date().getTime();

    const paymentReq = {
      order_id: orderId,
      items: "Order Checkout",
      amount: calculatedTotal,
      currency: "LKR",
      first_name: user.name || "Customer",
      last_name: "",
      email: user.email || "customer@example.com",
      phone: phone,
      address: address,
      city: "Colombo",
      country: "Sri Lanka",
    };

    try {
      const hashRes = await getPayHereHash(paymentReq);

      if (hashRes && hashRes.hash) {
        const payment = {
          sandbox: true, // Set to false in production
          merchant_id: hashRes.merchant_id,
          return_url: undefined,
          cancel_url: undefined,
          notify_url: `${apiURL}/api/payhere/notify`,
          order_id: orderId,
          items: "Order Checkout",
          amount: calculatedTotal,
          currency: "LKR",
          hash: hashRes.hash,
          first_name: user.name || "Customer",
          last_name: "",
          email: user.email || "customer@example.com",
          phone: phone,
          address: address,
          city: "Colombo",
          country: "Sri Lanka",
        };

        if (window.payhere) {
          window.payhere.startPayment(payment);
        } else {
          setError("PayHere gateway script not loaded. Please refresh the page.");
          setIsProcessing(false);
        }
      } else {
        setError("Failed to initialize payment hash from server.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("PayHere Hash Error:", err);
      setError("Server connection failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (data?.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
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
        <span className="text-gray-600 font-semibold text-sm">Loading Order Details...</span>
      </div>
    );
  }

  return (
    <Fragment>
      <section className="mx-4 my-8 md:mx-12 md:my-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
          Checkout Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Products List */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Items in Order</h2>
            <CheckoutProducts products={data?.cartProduct || []} />
          </div>

          {/* Right Column: Customer Details & Payment */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm py-3 px-4 rounded-xl mb-4 font-medium flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePayHerePayment} className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-xs font-bold uppercase text-gray-600 tracking-wider mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="Enter complete house address, street, town..."
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase text-gray-600 tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="077XXXXXXX or +9477XXXXXXX"
                    className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition"
                  />
                </div>

                {/* Pricing Summary */}
                <div className="border-t border-gray-100 pt-4 mt-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>LKR {calculatedTotal.toLocaleString("en-LK")}.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charge</span>
                    <span className="text-emerald-600 font-semibold">Calculated on dispatch</span>
                  </div>
                  <div className="flex justify-between text-lg font-extrabold text-gray-900 border-t border-gray-100 pt-3 mt-2">
                    <span>Total Amount</span>
                    <span className="text-yellow-700">LKR {calculatedTotal.toLocaleString("en-LK")}.00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || calculatedTotal <= 0}
                  className="w-full rounded-xl bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 transition active:scale-[0.98] shadow-lg shadow-yellow-600/20 uppercase text-sm tracking-wider mt-6 disabled:opacity-50"
                >
                  {isProcessing ? "Processing Payment..." : "Pay with PayHere"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export const CheckoutProducts = ({ products }) => {
  const history = useHistory();

  const getImageUrl = (imageName) => {
    if (!imageName) return "/placeholder.png";
    if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
      return imageName;
    }
    return `${apiURL}/uploads/products/${imageName}`;
  };

  if (!products || products.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 font-medium">
        No items found in cart for checkout.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {products.map((product, index) => {
        const itemQty = quantity(product._id);
        const itemSubTotal = subTotal(product._id, product.pPrice);

        return (
          <div key={index} className="py-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div
                onClick={() => history.push(`/products/${product._id}`)}
                className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden cursor-pointer flex-shrink-0 bg-gray-50 flex items-center justify-center hover:opacity-80 transition"
              >
                <img
                  className="max-h-full max-w-full object-contain"
                  src={getImageUrl(product.pImages?.[0])}
                  alt={product.pName || "Product"}
                />
              </div>

              <div>
                <h3
                  onClick={() => history.push(`/products/${product._id}`)}
                  className="font-bold text-gray-800 text-base cursor-pointer hover:text-yellow-600 transition line-clamp-1"
                >
                  {product.pName}
                </h3>
                <div className="text-xs text-gray-500 mt-0.5 space-x-2">
                  <span>Price: LKR {parseFloat(product.pPrice || 0).toLocaleString("en-LK")}.00</span>
                  <span>•</span>
                  <span>Qty: {itemQty}</span>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-sm font-extrabold text-gray-900">
                LKR {parseFloat(itemSubTotal || 0).toLocaleString("en-LK")}.00
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutProducts;