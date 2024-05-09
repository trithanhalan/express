const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.id === 1) {
    next();
  } else {
    res.status(403).json({ message: "Insufficient privileges" });
  }
};

module.exports = { authenticate, isAdmin };
