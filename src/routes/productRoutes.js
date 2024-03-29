// src/routes/productRoutes.js

const express = require("express");
const productController = require("../controller/productController");

const router = express.Router();

router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getOneProduct);
router.post("/products", productController.createProduct);
router.patch("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
