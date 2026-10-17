const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
const mongoose = require("mongoose");

function parseDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null;
}
exports.parseDateOnly = parseDateOnly;

// BOOK A ROOM: a logged-in user books a room for a date range
exports.createBooking = async (req, res) => {
  try {
    const { roomId } = req.body;
    const from = parseDateOnly(req.body.fromdate);
    const to = parseDateOnly(req.body.todate);
    if (!roomId || !from || !to || to <= from) return res.status(400).json({ message: "Choose valid check-in and check-out dates." });
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (from < today) return res.status(400).json({ message: "Check-in cannot be in the past." });
    const totaldays = (to - from) / 86400000;
    if (totaldays > 365) return res.status(400).json({ message: "A stay cannot exceed 365 nights." });

    if (!mongoose.Types.ObjectId.isValid(roomId)) return res.status(400).json({ message: "Invalid room ID." });
    const guest = await User.findById(req.user.id).select("name");
    if (!guest) return res.status(401).json({ message: "Account not found. Please sign in again." });

    const session = await mongoose.startSession();
    let booking;
    let missingRoom = false;
    let unavailable = false;
    try {
      // The shared room write serializes concurrent reservations for the same inventory.
      // The transaction requires MongoDB replica-set support (including Atlas).
      await session.withTransaction(async () => {
        booking = undefined;
        missingRoom = false;
        unavailable = false;
        const room = await Room.findById(roomId).session(session);
        if (!room) { missingRoom = true; return; }
        const overlapping = await Booking.countDocuments({
          room: roomId,
          status: "booked",
          fromdate: { $lt: to },
          todate: { $gt: from },
        }).session(session);
        if (overlapping >= room.count) { unavailable = true; return; }
        await Room.updateOne({ _id: roomId }, { $inc: { bookingVersion: 1 } }, { session });
        booking = new Booking({
          room: roomId,
          user: req.user.id,
          guestName: guest.name,
          fromdate: from,
          todate: to,
          totaldays,
          totalAmount: totaldays * room.rent,
          paymentStatus: "not_configured",
        });
        await booking.save({ session });
      });
    } finally {
      await session.endSession();
    }
    if (missingRoom) return res.status(404).json({ message: "Room not found" });
    if (unavailable) return res.status(409).json({ message: "Room not available for these dates" });

    res.status(201).json({ message: "Room booked successfully", booking });
  } catch (err) {
    console.error("Create booking error:", err.message);
    res.status(500).json({ message: "Could not create the booking right now." });
  }
};

// MY BOOKINGS: all bookings of the logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room", "roomNumber name description photos type rent count");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// CANCEL: a user cancels their own booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (typeof bookingId !== "string" || !/^[a-f\d]{24}$/i.test(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only the owner of the booking (or an admin) can cancel it
    if (booking.user.toString() !== req.user.id && req.user.type !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ALL BOOKINGS: for the admin dashboard
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room").populate("user", "name email phone");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
