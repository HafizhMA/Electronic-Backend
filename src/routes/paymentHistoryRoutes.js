const express = require('express');
const paymentController = require("../controller/paymentHistoryController");
const router = express.Router();

router.get('/getCheckoutPayment', paymentController.checkoutPayment);
router.post('/checkPaymentStatus', paymentController.checkStatusPayment);

module.exports = router;