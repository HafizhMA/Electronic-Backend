// src/routes/productRoutes.js

const express = require("express");
const productController = require("../controller/productController");
const authenticateToken = require("../middlewares/protectRouteMiddleware");

const router = express.Router();

router.get("/products", productController.getProducts);
router.get("/products/search", productController.searchProduct);
router.get("/products/:id", productController.getOneProduct);
router.post("/products", productController.createProduct);
router.patch("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.post("/addToCart", productController.postOneCart);
router.get("/getcarts", productController.getProductCart);
router.patch("/cart/increment/:id", productController.incrementCartItemQuantity);
router.patch("/cart/decrement/:id", productController.decrementCartItemQuantity)

module.exports = router;
