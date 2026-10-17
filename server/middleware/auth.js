const jwt = require("jsonwebtoken");

// Check that the request has a valid token
exports.verifyToken = (req, res, next) => {
  // The token arrives in the header as: Authorization: Bearer <token>
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  const token = header.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ message: "Authentication is not configured on this server." });
  }

  try {
    // Check the token was signed with our secret and hasn't expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !["admin", "customer"].includes(decoded.type)) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // keep the user's id and type for later
    next(); // token is fine, continue to the route
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Allow only admins through
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.type !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
