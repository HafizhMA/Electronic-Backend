const express = require('express');
const checkoutController = require("../controller/checkoutController");
const router = express.Router();

router.post('/createAlamat', checkoutController.postAlamat);

module.exports = router;

