const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/protectRouteMiddleware.js');

const userController = require("../controller/userController");

router.post("/register", userController.register);
router.get("/getUserByEmail/:email", authenticateToken, userController.getUserByEmail);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/check-token", userController.checkToken);
router.post("/update-password/:token", userController.updatePassword);
router.post("/userLogin", userController.getUserLogin);
router.post("/image_profile", userController.uplaodImage);

module.exports = router;