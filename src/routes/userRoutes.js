const express = require('express');
const router = express.Router();

const userController = require("../controller/userController");

router.post("/register", userController.register);
router.get("/getUserByEmail/:email", userController.getUserByEmail);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/check-token", userController.checkToken);
router.post("/update-password", userController.updatePassword);

module.exports = router;