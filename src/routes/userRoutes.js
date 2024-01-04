const express = require('express');
const router = express.Router();

const userController = require("../controller/userController");

router.post("/register", userController.register);
router.get("/getUserByEmail/:id", userController.getUserByEmail);
router.post("/login", userController.login);


module.exports = router;