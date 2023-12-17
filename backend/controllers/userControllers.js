const asyncHandler=require('express-async-handler')
const User = require( '../models/usermodel' )
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')


const getUser=asyncHandler(async(req,res)=>{
  try {
    const user=await User.find();
    res.json({user})
  } catch (error) {
    res.json({message:"User not found yet"})
  }
})

const createUser=asyncHandler(async(req,res)=>{
    const {username,firstname,email,password}=req.body;
    if(!username || !firstname || !email || !password){
        res.status(404).json({message:"Please fill required field"})
    }

})
module.exports={getUser}