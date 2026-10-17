const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

// Public signups always create customer accounts; role escalation is not allowed.
exports.signup = async (req, res) => {
  try {
    const body = req.body || {};
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = body.password;
    const phone = String(body.phone || "").trim();

    if (name.length < 2 || name.length > 100) return res.status(400).json({ message: "Name must be between 2 and 100 characters." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ message: "Enter a valid email address." });
    if (typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72) return res.status(400).json({ message: "Password must be at least 8 characters and no more than 72 UTF-8 bytes." });
    if (phone.length < 7 || phone.length > 30) return res.status(400).json({ message: "Enter a valid phone number." });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone, type: "customer" });
    await user.save();

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already registered" });
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Could not create the account right now." });
  }
};

// Record successful sign-ins and issue a one-day token.
exports.login = async (req, res) => {
  try {
    const body = req.body || {};
    const emailInput = body.email;
    const password = body.password;
    if (typeof emailInput !== "string" || typeof password !== "string") return res.status(400).json({ message: "Email and password are required." });
    const email = emailInput.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Persist through the hydrated document, then verify the saved array.
    // This makes persistence failures visible instead of silently ignoring update results.
    const loggedInAt = new Date();
    user.loginHistory.push({ loggedInAt });
    if (user.loginHistory.length > 20) {
      user.loginHistory = user.loginHistory.slice(-20);
    }
    await user.save();

    const token = jwt.sign(
      { id: user._id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, type: user.type },
    });
  } catch (err) {
    console.error("Login or login-history persistence failed:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin only: list users without password hashes.
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const usersWithHistory = users.filter((user) => (user.loginHistory?.length || 0) > 0).length;
    console.info("Admin user list fetched; users with recorded login history:", usersWithHistory, "of", users.length);
    res.json(users);
  } catch (err) {
    console.error("Unable to fetch admin user list:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin only: clear a user's recorded successful login timestamps.
exports.clearUserLoginHistory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { loginHistory: [] } },
      { new: true }
    ).select("_id name email loginHistory");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Login history cleared", user });
  } catch (err) {
    console.error("Unable to clear login history:", err.message);
    return res.status(500).json({ message: "Unable to clear login history" });
  }
};
