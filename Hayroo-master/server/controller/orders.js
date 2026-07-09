// C:\lakmal_code\com_v5\com_v5\Hayroo-master\server\controller\orders.js
const orderModel = require("../models/orders");
const crypto = require("crypto");

class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  // PayHere Checkout Hash Generator (Frontend Form Popup සඳහා)
  async generatePayhereHash(req, res) {
    try {
      const { order_id, amount, currency } = req.body;
      const merchantId = process.env.PAYHERE_MERCHANT_ID;
      const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

      const formattedAmount = Number(amount)
        .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .replaceAll(",", "");

      const hashedSecret = crypto
        .createHash("md5")
        .update(merchantSecret)
        .digest("hex")
        .toUpperCase();

      const hash = crypto
        .createHash("md5")
        .update(merchantId + order_id + formattedAmount + currency + hashedSecret)
        .digest("hex")
        .toUpperCase();

      return res.json({
        merchant_id: merchantId,
        hash: hash,
        amount: formattedAmount,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Hash generation failed" });
    }
  }

  // Payment එක සාර්ථක වූ පසු Order එක Database එකට Save කිරීම
  async postCreateOrder(req, res) {
    let { allProduct, user, amount, transactionId, address, phone } = req.body;
    if (
      !allProduct ||
      !user ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      return res.json({ message: "All fields are required" });
    } else {
      try {
        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
          status: "Processing"
        });
        let save = await newOrder.save();
        if (save) {
          return res.json({ success: "Order created successfully", order: save });
        }
      } catch (err) {
        return res.json({ error: err.message });
      }
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All fields are required" });
    } else {
      try {
        let currentOrder = await orderModel.findByIdAndUpdate(oId, {
          status: status,
          updatedAt: Date.now(),
        });
        return res.json({ success: "Order updated successfully" });
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All fields are required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
const ordersController = new Order();
module.exports = ordersController;