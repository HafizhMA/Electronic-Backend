const express = require('express');
const authenticateToken = require('../middleware/protectRouteMiddleware')

const router = express.Router();
router.use('/detail', authenticateToken)
router.use('/checkout-barang', authenticateToken)