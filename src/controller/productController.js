// src/controller/productController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const newProductData = req.body;

  if (!newProductData.namaBarang || !newProductData.deskripsiBarang || !newProductData.hargaBarang || !newProductData.quantity) {
    return res.status(400).send({
      status: 400,
      message: "Bad Request: Missing required data",
    });
  }

  try {
    const product = await prisma.product.create({
      data: {
        namaBarang: newProductData.namaBarang,
        deskripsiBarang: newProductData.deskripsiBarang,
        img: newProductData.img,
        hargaBarang: newProductData.hargaBarang,
        quantity: newProductData.quantity,
      },
    });

    res.status(201).send({
      status: 201,
      data: product,
      message: "Data successfully posted",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;

  if (!updatedProductData.namaBarang || !updatedProductData.deskripsiBarang || !updatedProductData.hargaBarang || !updatedProductData.quantity) {
    return res.status(400).send({
      status: 400,
      message: "Bad Request: Missing required data",
    });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        namaBarang: updatedProductData.namaBarang,
        deskripsiBarang: updatedProductData.deskripsiBarang,
        img: updatedProductData.img,
        hargaBarang: updatedProductData.hargaBarang,
        quantity: updatedProductData.quantity,
      },
    });

    res.send({
      status: 200,
      data: updatedProduct,
      message: "Data successfully updated",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    res.send({
      status: 200,
      message: "Data successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};
