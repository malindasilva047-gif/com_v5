// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\partials\Mixins.js

export const subTotal = (id, price) => {
  let subTotalCost = 0;
  try {
    let carts = JSON.parse(localStorage.getItem("cart")) || [];
    carts.forEach((item) => {
      if (item.id === id || item._id === id) {
        const itemQty = parseInt(item.quantity || item.quantitiy || 1, 10);
        const itemPrice = parseFloat(price || item.price || item.pPrice || 0);
        subTotalCost = itemQty * itemPrice;
      }
    });
  } catch (err) {
    console.error("subTotal calculation error:", err);
  }
  return isNaN(subTotalCost) ? 0 : subTotalCost;
};

export const quantity = (id) => {
  let productQty = 0;
  try {
    let carts = JSON.parse(localStorage.getItem("cart")) || [];
    carts.forEach((item) => {
      if (item.id === id || item._id === id) {
        productQty = parseInt(item.quantity || item.quantitiy || 0, 10);
      }
    });
  } catch (err) {
    console.error("quantity calculation error:", err);
  }
  return isNaN(productQty) ? 0 : productQty;
};

export const totalCost = () => {
  let totalCostAmount = 0;
  try {
    let carts = JSON.parse(localStorage.getItem("cart")) || [];
    carts.forEach((item) => {
      const itemQty = parseInt(item.quantity || item.quantitiy || 1, 10);
      const itemPrice = parseFloat(item.price || item.pPrice || 0);
      if (!isNaN(itemQty) && !isNaN(itemPrice)) {
        totalCostAmount += itemQty * itemPrice;
      }
    });
  } catch (err) {
    console.error("totalCost calculation error:", err);
  }
  return isNaN(totalCostAmount) ? 0 : totalCostAmount;
};