// src/controller/productController.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.getOneProduct = async (req, res) => {
  const { id } = req.params; // Assuming the product ID is in the request parameters

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (product) {
    return res.json({
      status: 200,
      data: product,
    });
  } else {
    return res.json({
      status: 404,
      message: "No such data",
    });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const newProductData = req.body;

  try {
    const product = await prisma.product.create({
      data: newProductData, // Use the entire data object directly
    });

    res.status(201).json({
      status: 201,
      data: product,
      message: "Data successfully posted",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to create product",
      error: error.message // Send detailed error message for debugging
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updatedProductData,
    });

    res.status(200).json({
      status: 200,
      data: updatedProduct,
      message: "Data successfully updated",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to update product",
      error: error.message // Send detailed error message for debugging
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

    res.json({
      status: 200,
      message: "Data successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.postOneCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    // Cek apakah produk sudah ada di keranjang pengguna
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Jika produk sudah ada di keranjang, tambahkan kuantitasnya
      cartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + 1,
        },
      });
    } else {
      // Jika produk belum ada di keranjang, buat item keranjang baru
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      });
    }

    res.status(200).json({ cartItem, message: 'Successfully added product to cart' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'An error occurred while adding product to cart' });
  }
};

exports.getProductCart = async (req, res) => {
  try {
    const cart = await prisma.cartItem.findMany({
      include: {
        product: {
          include: {
            user: true // Ini akan menyertakan informasi pengguna untuk setiap produk
          }
        },
        user: true // Ini akan menyertakan informasi pengguna untuk setiap keranjang belanja
      }
    });

    return res.status(200).json({
      cart,
      message: 'Berhasil mendapatkan keranjang belanja'
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      error: 'Gagal mendapatkan keranjang belanja'
    });
  }
};



