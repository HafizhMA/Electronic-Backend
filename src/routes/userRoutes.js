const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/protectRouteMiddleware')

const userController = require("../controller/userController");

router.post("/register", userController.register);
router.get("/getUserByEmail/:email", authenticateToken, userController.getUserByEmail);
router.post("/login", userController.login);
router.post("/forgot-password", authenticateToken, userController.forgotPassword);
router.post("/check-token", authenticateToken, userController.checkToken);
router.post("/update-password/:token", authenticateToken, userController.updatePassword);

module.exports = router;