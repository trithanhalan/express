const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Fetch all users
router.get("/", userController.getAllUsers);

// User login
router.post("/login", userController.loginUser);

module.exports = router;
