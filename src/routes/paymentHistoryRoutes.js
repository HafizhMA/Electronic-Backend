const express = require('express');
const paymentController = require("../controller/paymentHistoryController");
const router = express.Router();

router.post('/getCheckoutPayment', paymentController.checkoutPayment);
router.post('/checkPaymentStatus', paymentController.checkStatusPayment);
router.post('/getOneHistoryCheckout', paymentController.getOneHistoryCheckout);

module.exports = router;