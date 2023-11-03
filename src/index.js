const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("hallo");
});

app.get("/products", async (req, res) => {
  // select * from product
  const products = await prisma.product.findMany();

  res.send(products);
});

app.post("/products", async (req, res) => {
  const newProductData = req.body;

  // Check jika field missing atau kosong
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
});

app.patch("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;

  // Check jika field missing atau kosong
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
});


app.delete("/products/:id", async (req, res) => {
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
});


app.listen(PORT, () => {
  console.log(`express api running on port ${PORT}`);
});
