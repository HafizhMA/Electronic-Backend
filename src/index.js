// app.js (atau index.js)

const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

// Impor rute product
const productRoutes = require("./routes/productRoutes");
app.use(productRoutes);

const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);

app.get("/api", (req, res) => {
  res.send("hallo");
});

app.listen(PORT, () => {
  console.log(`express api running on port ${PORT}`);
});
