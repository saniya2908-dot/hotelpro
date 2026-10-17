const mongoose = require("mongoose");

// A schema describes what one room looks like in the database
const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true, default: "" },
    description: { type: String, required: true },
    photos: [{ type: String }],
    type: { type: String, enum: ["single", "double", "suite"], required: true },
    rent: { type: Number, required: true },
    count: { type: Number, default: 1 },
    bookingVersion: { type: Number, default: 0, select: false },
    currentBookings: [
      {
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fromdate: { type: Date },
        todate: { type: Date },
        status: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
