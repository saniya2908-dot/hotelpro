const express = require("express");
const router = express.Router();
const { signup, login, getUsers, clearUserLoginHistory } = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);

// Admin-only user listing and login-history management.
router.get("/users", verifyToken, isAdmin, getUsers);
router.delete("/users/:userId/login-history", verifyToken, isAdmin, clearUserLoginHistory);

module.exports = router;
