const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const User = require("../models/usermodel");

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request: Token missing" });
    }

    jwt.verify(token, 'your-secret-key', async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Access Token" });
      }

      const user = await User.findById(decodedToken?.userId).select("-password -refreshToken");

      if (!user) {
        return res.status(401).json({ message: "Invalid User" });
      }

      req.user = user;
      req.accessToken = token;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
});

module.exports = verifyJwt;
