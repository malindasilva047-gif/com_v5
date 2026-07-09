// import axios from "axios";
// const apiURL = process.env.REACT_APP_API_URL;

// export const getBrainTreeToken = async () => {
//   let uId = JSON.parse(localStorage.getItem("jwt")).user._id;
//   try {
//     let res = await axios.post(`${apiURL}/api/braintree/get-token`, {
//       uId: uId,
//     });
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const getPaymentProcess = async (paymentData) => {
//   try {
//     let res = await axios.post(`${apiURL}/api/braintree/payment`, paymentData);
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const createOrder = async (orderData) => {
//   try {
//     let res = await axios.post(`${apiURL}/api/order/create-order`, orderData);
//     return res.data;
//   } catch (error) {
//     console.log(error);
//   }
// };


import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// Generate PayHere Parameters and Hash from Backend
export const getPayHereHash = async (paymentData) => {
  try {
    let res = await axios.post(`${apiURL}/api/payhere/generate-hash`, paymentData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = async (orderData) => {
  try {
    let res = await axios.post(`${apiURL}/api/order/create-order`, orderData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};