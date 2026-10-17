const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    loggedInAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ["admin", "customer"], default: "customer" },
    loginHistory: { type: [loginHistorySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
