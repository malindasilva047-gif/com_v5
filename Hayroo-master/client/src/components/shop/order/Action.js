// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\order\Action.js
import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      dispatch({ type: "cartProduct", payload: responseData.Products });
    } else {
      dispatch({ type: "cartProduct", payload: [] });
    }
  } catch (error) {
    console.error("Cart fetch error:", error);
    dispatch({ type: "cartProduct", payload: [] });
  } finally {
    dispatch({ type: "loading", payload: false });
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
    }
  } catch (error) {
    console.error("BrainTree Token Error:", error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  totalCost,
  history
) => {
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    let nonce;
    state.instance
      .requestPaymentMethod()
      .then((data) => {
        dispatch({ type: "loading", payload: true });
        nonce = data.nonce;
        let paymentData = {
          amountTotal: totalCost(),
          paymentMethod: nonce,
        };
        getPaymentProcess(paymentData)
          .then(async (res) => {
            if (res) {
              let orderData = {
                allProduct: JSON.parse(localStorage.getItem("cart")) || [],
                user: JSON.parse(localStorage.getItem("jwt"))?.user?._id,
                amount: res.transaction.amount,
                transactionId: res.transaction.id,
                address: state.address,
                phone: state.phone,
              };
              try {
                let resposeData = await createOrder(orderData);
                if (resposeData.success) {
                  localStorage.removeItem("cart");
                  dispatch({ type: "cartProduct", payload: null });
                  dispatch({ type: "cartTotalCost", payload: null });
                  dispatch({ type: "orderSuccess", payload: true });
                  setState({ clientToken: "", instance: {} });
                  dispatch({ type: "loading", payload: false });
                  return history.push("/");
                } else if (resposeData.error) {
                  console.error(resposeData.error);
                }
              } catch (error) {
                console.error("Order completion error:", error);
              }
            }
          })
          .catch((err) => {
            console.error("Payment processing error:", err);
          });
      })
      .catch((error) => {
        console.error("Payment method error:", error);
        setState({ ...state, error: error.message });
      });
  }
};