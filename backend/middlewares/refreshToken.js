const asyncHandler=require('express-async-handler')
const jwt=require("jsonwebtoken");
const User = require( '../models/usermodel' );


const refreshAccessTokenMiddleware = async (req, res, next) => {
    try {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
      if (!incomingRefreshToken) {
        return res.status(401).json({ message: "Unauthorized request" });
      }
  
      const decodedToken = jwt.verify(incomingRefreshToken, 'your-refresh-secret');
      const user = await User.findById(decodedToken?.userId);
  
      if (!user || incomingRefreshToken !== user?.refreshToken) {
        return res.status(401).json({ message: "Invalid Refresh token" });
      }
  
      const accessToken = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '24h' });
      const newRefreshToken = jwt.sign({ userId: user._id }, 'your-refresh-secret', { expiresIn: '7d' });
  
      user.refreshToken = newRefreshToken;
      await user.save();
  
      const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      };
  
      // Set the new tokens in cookies or headers based on your requirement
      res.cookie("accessToken", accessToken, options);
      res.cookie("refreshToken", newRefreshToken, options);
  
      // You can also set the tokens in response headers
      // res.set('accessToken', accessToken);
      // res.set('refreshToken', newRefreshToken);
  
      // You can attach the new tokens to the request for use in the route handler
      req.accessToken = accessToken;
      req.refreshToken = newRefreshToken;
  
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      return res.status(500).json({ message: "Error refreshing tokens" });
    }
  };
  
  module.exports = refreshAccessTokenMiddleware;
  

