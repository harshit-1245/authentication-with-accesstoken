const mongoose=require('mongoose')
const jwt=require("jsonwebtoken");
require("dotenv").config()

const userSchema=new mongoose.Schema({
    username:{               // Defines a field named 'username'
        type:String,         // Specifies the data type as String
        required:true,       // Indicates that this field is mandatory
        unique:true,         // Ensures each 'username' value is unique
        lowercase:true,      // Converts the 'username' to lowercase
        trim:true,           // Removes any whitespace from the beginning and end
        index:true,          // Creates an index for faster retrieval
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
   
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
    }
    


},{timestamps : true})

// Define a method to generate a refresh token

userSchema.methods.generateRefreshToken=function(){
    const refreshToken=jwt.sign(
        {_id:this._id}, // Payload with user ID or any other necessary information
        process.env.REFRESH_TOKEN_SECRET, // Replace with your refresh token secret
        {expiresIn: '7d'} // Set the expiration for the refresh token as needed
    );

    this.refreshToken=refreshToken; // Update the refreshToken field in the schema
    return refreshToken; // Return the generated refresh token
}

const User=mongoose.model('User',userSchema)

module.exports=User;