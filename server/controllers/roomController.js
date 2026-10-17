const Room = require("../models/Room");

// ADD ROOM: validate admin input and persist the room in MongoDB.
exports.addRoom = async (req, res) => {
  try {
    const roomNumber = String(req.body.roomNumber || "").trim();
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const type = String(req.body.type || "").trim().toLowerCase();
    const rent = Number(req.body.rent);
    const count = Number(req.body.count ?? 1);
    const photos = Array.isArray(req.body.photos)
      ? req.body.photos.map((photo) => String(photo).trim()).filter(Boolean).slice(0, 5)
      : [];

    if (!roomNumber || !description) {
      return res.status(400).json({ message: "Room number and description are required." });
    }
    if (description.length > 1200) {
      return res.status(400).json({ message: "Description must be 1,200 characters or fewer." });
    }
    if (!["single", "double", "suite"].includes(type)) {
      return res.status(400).json({ message: "Choose a valid room type." });
    }
    if (!Number.isFinite(rent) || rent <= 0) {
      return res.status(400).json({ message: "Nightly rent must be a positive number." });
    }
    if (!Number.isInteger(count) || count < 1) {
      return res.status(400).json({ message: "Room count must be a whole number greater than zero." });
    }
    if (photos.some((photo) => {
      try { const url = new URL(photo); return !["http:", "https:"].includes(url.protocol); }
      catch { return true; }
    })) {
      return res.status(400).json({ message: "Room image must be a valid HTTP or HTTPS URL." });
    }

    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(409).json({ message: "That room number already exists. Use a unique room number." });
    }

    const room = await Room.create({ roomNumber, name, description, photos, type, rent, count });
    return res.status(201).json({ message: "Room added successfully.", room });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "That room number already exists. Use a unique room number." });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Add room error:", err);
    return res.status(500).json({ message: "Could not add the room right now. Please try again." });
  }
};

// GET ALL ROOMS: return every room in the database.
exports.getRooms = async (req, res) => {
  try {
    // Never expose internal reservation records or guest IDs from room documents.
    const rooms = await Room.find().select("roomNumber name description photos type rent count createdAt").sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    console.error("Get rooms error:", err);
    res.status(500).json({ message: "Could not load rooms right now." });
  }
};
