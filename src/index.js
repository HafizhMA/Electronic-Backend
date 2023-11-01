const express = require ("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();


dotenv.config();

const PORT = process.env.PORT;

app.use(express.json())

app.get("/api", (req, res) => {
    res.send("hallo");
});

app.get("/products", async (req,res) => {
    // select * from product
    const products = await prisma.product.findMany();

    res.send(products);
});

app.post("/products", async (req, res) => {
    const newProductData = req.body;

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


app.listen(PORT,() =>{
    console.log(`express api running on port ${PORT}`);
});