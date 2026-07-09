const crypto = require("crypto");

class PayHere {
  generateHash(req, res) {
    try {
      const { order_id, amount, currency } = req.body;

      const merchantId = process.env.PAYHERE_MERCHANT_ID;
      const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

      if (!merchantId || !merchantSecret) {
        return res.status(500).json({ error: "PayHere credentials missing in .env" });
      }

      // Format amount to 2 decimal places (e.g., 1000.00)
      const formattedAmount = Number(amount)
        .toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        .replace(/,/g, "");

      // Hash generation formula: MD5(merchant_id + order_id + amount + currency + MD5(merchant_secret))
      const hashedSecret = crypto
        .createHash("md5")
        .update(merchantSecret)
        .digest("hex")
        .toUpperCase();

      const mainString = merchantId + order_id + formattedAmount + currency + hashedSecret;

      const hash = crypto
        .createHash("md5")
        .update(mainString)
        .digest("hex")
        .toUpperCase();

      return res.json({
        merchant_id: merchantId,
        hash: hash,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error generating hash" });
    }
  }
}

const payhereController = new PayHere();
module.exports = payhereController;