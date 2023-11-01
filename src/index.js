const express = require ("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();


dotenv.config();

const PORT = process.env.PORT;

app.get("/api", (req, res) => {
    res.send("hallo");
});

app.get("/products", async (req,res) => {
    // select * from product
    const products = await prisma.product.findMany();

    res.send(products);
});

app.listen(PORT,() =>{
    console.log(`express api running on port ${PORT}`);
});