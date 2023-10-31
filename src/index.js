const express = require ("express");
const dotenv = require("dotenv");
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();


dotenv.config();

const PORT = process.env.PORT;

app.get("/api", (req, res) => {
    res.send("hallo");
});

app.listen(PORT,() =>{
    console.log(`express api running on port ${PORT}`);
});