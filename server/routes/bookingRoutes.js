const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Any logged-in user
router.post("/book", verifyToken, createBooking);
router.get("/mybookings", verifyToken, getMyBookings);
router.post("/cancelbooking", verifyToken, cancelBooking);

// Admin only
router.get("/all", verifyToken, isAdmin, getAllBookings);

module.exports = router;