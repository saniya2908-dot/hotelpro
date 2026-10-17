// Load secrets from the .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Room = require("./models/Room");

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error("Origin is not allowed by CORS"));
} }));
app.use(express.json());

// Starter inventory is inserted by room number only when missing.
// Existing rooms and bookings are never overwritten.
const starterRooms = [
  { roomNumber: "101", description: "A calm, comfortable room with everything you need to recharge.", photos: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85"], type: "single", rent: 1500, count: 1 },
  { roomNumber: "102", description: "A bright, welcoming space for a restful overnight stay.", photos: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=85"], type: "single", rent: 1600, count: 1 },
  { roomNumber: "103", description: "A practical retreat with a cosy bed and a quiet atmosphere.", photos: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85"], type: "single", rent: 1700, count: 1 },
  { roomNumber: "104", description: "A simple, thoughtfully arranged room for solo travellers.", photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=85"], type: "single", rent: 1800, count: 1 },
  { roomNumber: "105", description: "A warm and inviting room to settle into after a long day.", photos: ["https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=1000&q=85"], type: "single", rent: 1900, count: 1 },
  { roomNumber: "201", description: "A spacious double room made for sharing the stay in comfort.", photos: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85"], type: "double", rent: 2500, count: 1 },
  { roomNumber: "202", description: "A relaxed room with extra space to unpack and unwind.", photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85"], type: "double", rent: 2600, count: 1 },
  { roomNumber: "203", description: "A comfortable choice for couples and weekend explorers.", photos: ["https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85"], type: "double", rent: 2700, count: 1 },
  { roomNumber: "204", description: "A light-filled retreat with room to slow down together.", photos: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85"], type: "double", rent: 2800, count: 1 },
  { roomNumber: "205", description: "An easy-going room for a longer weekend or a work trip.", photos: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=85"], type: "double", rent: 2900, count: 1 },
  { roomNumber: "301", description: "A premium suite with generous space and a little extra luxury.", photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85"], type: "suite", rent: 4000, count: 1 },
  { roomNumber: "302", description: "An elevated stay with a calm palette and room to relax.", photos: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85"], type: "suite", rent: 4200, count: 1 },
  { roomNumber: "303", description: "A spacious suite for travellers who like to spread out.", photos: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85"], type: "suite", rent: 4400, count: 1 },
  { roomNumber: "304", description: "A polished retreat for a special occasion or longer escape.", photos: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"], type: "suite", rent: 4700, count: 1 },
  { roomNumber: "305", description: "A generous, comfortable suite designed for an unhurried stay.", photos: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"], type: "suite", rent: 5000, count: 1 },
];

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Set MONGO_URI and a JWT_SECRET of at least 32 characters before starting HotelPro.");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const roomNumbers = starterRooms.map((room) => room.roomNumber);
  const existingRoomNumbers = await Room.distinct("roomNumber", {
    roomNumber: { $in: roomNumbers },
  });
  const existing = new Set(existingRoomNumbers);
  const missingRooms = starterRooms.filter((room) => !existing.has(room.roomNumber));

  if (missingRooms.length > 0) {
    await Room.insertMany(missingRooms);
    console.log(`Added ${missingRooms.length} missing starter rooms; inventory now includes the starter set.`);
  } else {
    console.log("Starter room inventory is already present");
  }
  const PORT = process.env.PORT || 8001;
  app.listen(PORT, () => console.log(`HotelPro server running on port ${PORT}`));
}

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

app.get("/", (req, res) => {
  res.send("HotelPro server is running");
});

if (require.main === module) {
  start().catch((err) => {
    console.error("HotelPro startup failed:", err.message);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
