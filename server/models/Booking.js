const mongoose = require("mongoose");

// A schema describes what one booking looks like in the database
const bookingSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    guestName: { type: String, required: true },
    fromdate: { type: Date, required: true },
    todate: { type: Date, required: true },
    totaldays: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
    paymentStatus: { type: String, enum: ["not_configured", "pending", "paid", "failed", "refunded"], default: "not_configured" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
