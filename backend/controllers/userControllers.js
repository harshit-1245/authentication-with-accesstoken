const asyncHandler=require('express-async-handler')
const User = require( '../models/usermodel' )
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const { ApiResponse } = require( '../utils/ApiResponse' )






const getUser=asyncHandler(async(req,res)=>{
  try {
    const user=await User.find();
    res.json({user})
  } catch (error) {
    res.json({message:"User not found yet"})
  }
})

const createUser=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        res.status(404).json({message:"Please fill required field"})
    }
   const existedUser=await User.findOne({
    $or :[{username},{email}]
   })
   if(existedUser){
    res.json({message:"User ALready registered"})
   }
   const hashedPassword= await bcrypt.hash(password,10);


  const user = await   User.create({
      email,
      password:hashedPassword,
      username: username.toLowerCase()
    })
   
     const token = jwt.sign({userId:user._id},'your-secret-key',{expiresIn:'24h'})

 // i dont want two field so 
 const createdUser = await User.findById(user._id).select('-password -refreshToken');

 if(!createdUser){
  res.status(404).json({message:"Something went wrong while registering"})
 }
  return res.status(201).json(
    new ApiResponse(200,{createdUser,token},"User registered successfully")
  )
})

const logInUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
   
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const accessToken = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '24h' });
    const refreshToken = user.generateRefreshToken(); // Using the user-defined method

    await user.save(); // Save the updated user document with the refresh token

      const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
      )
        const options = {
          httpOnly:true,
          secure:true,
        }

    // return res.status(200).json({
    //   message: 'Login successful',
    //   user: { _id: user._id, username: user.username },
    //   token,
    //   refreshToken,
    // });
         
     return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
     .json(
      new ApiResponse(200,{
        user:loggedInUser,accessToken,refreshToken
      },"User logged in successfully")
     )

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in' });
  }
});

const logOut = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: "" } }, // Use $unset to remove the refreshToken field
      { new: true }
    );

    // Clear both access and refresh tokens by clearing the respective cookies
    const options = {
      httpOnly: true,
      secure: true,
      expires: new Date(0), // Expire the cookies immediately
      sameSite: 'strict' // Set your preferred sameSite option
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json(new ApiResponse(200, {}, "User logged out"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, {}, "Error logging out"));
  }
});

module.exports = logOut;


module.exports = { getUser, createUser, logInUser,logOut };

