const express = require('express');
const authenticateToken = require('../middlewares/protectRouteMiddleware.js');

const router = express.Router();
router.use('/detail', authenticateToken)
router.use('/checkout-barang', authenticateToken)