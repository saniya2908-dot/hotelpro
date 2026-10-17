const express = require("express");
const router = express.Router();
const { addRoom, getRooms } = require("../controllers/roomController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Only a logged-in admin can add a room
router.post("/addroom", verifyToken, isAdmin, addRoom);

// Anyone can view rooms
router.get("/getrooms", getRooms);

module.exports = router;