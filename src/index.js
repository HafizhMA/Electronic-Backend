const express = require ("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.get("/api", (req, res) => {
    res.send("hallo gais");
});

app.listen(PORT,() =>{
    console.log(`express api running on port ${PORT}`);
});