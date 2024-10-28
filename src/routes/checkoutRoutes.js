const express = require('express');
const checkoutController = require("../controller/checkoutController");
const authenticateToken = require('../middlewares/protectRouteMiddleware');
const router = express.Router();

router.post('/createAlamat', checkoutController.postAlamat);
router.get('/getAlamat', checkoutController.getAlamat);
router.patch('/choosenAlamat', checkoutController.setAlamat);
router.put('/updateAlamat', checkoutController.updateAlamat);
router.delete('/deleteAlamat/:id', checkoutController.deleteAlamat);
router.get('/getCity', checkoutController.getCityOngkir);
router.get('/getProvince', checkoutController.getProvinceOngkir);
router.get('/getProvinceSatuan', checkoutController.getProvinceOngkirSatuan);
router.post('/getOngkir', checkoutController.getOngkir);
router.post('/connectJasaCart', checkoutController.connectJasaCart);
router.post('/postPesan', checkoutController.postPesan);
router.post('/getPayment', authenticateToken, checkoutController.midtransPayment);
router.post('/buyProduct', checkoutController.checkoutOneProduct);

module.exports = router;

