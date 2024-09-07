const express = require('express');
const checkoutController = require("../controller/checkoutController");
const router = express.Router();

router.post('/createAlamat', checkoutController.postAlamat);
router.get('/getAlamat', checkoutController.getAlamat);
router.patch('/choosenAlamat', checkoutController.setAlamat);

module.exports = router;

