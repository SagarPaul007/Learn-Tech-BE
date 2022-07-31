const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const validateUser = (req, res, next) => {
  function handleUserNotFound() {
    req.user = {};
    next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader) handleUserNotFound();
  const token = authHeader?.split(" ")[1];
  if (!token) handleUserNotFound();
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) handleUserNotFound();
    req.user = decoded;
    next();
  });
};

module.exports = { validateUser };
