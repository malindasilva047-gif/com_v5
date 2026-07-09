const express = require("express");
const router = express.Router();
const payhereController = require("../controller/payhere");

router.post("/payhere/generate-hash", payhereController.generateHash);

module.exports = router;