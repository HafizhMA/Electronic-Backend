// app.js (atau index.js)

const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require('cors')

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// Impor rute product
const productRoutes = require("./routes/productRoutes");
app.use(productRoutes);

const userRoutes = require("./routes/userRoutes");
app.use(userRoutes);

const checkoutRoutes = require("./routes/checkoutRoutes");
app.use(checkoutRoutes);

const paymentHistoryRoutes = require("./routes/paymentHistoryRoutes");
app.use(paymentHistoryRoutes);

app.get("/api", (req, res) => {
  res.send("hallo");
});

app.listen(PORT, () => {
  console.log(`express api running on port ${PORT}`);
});
