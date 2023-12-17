const mongoose=require("mongoose")
const colors=require("colors");
const { DB_NAME } = require( "../contraints" );

require("dotenv").config();

const connectDB=async()=>{
    try {
        const connection=await mongoose.connect(`${process.env.MONGODB_URI}`,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${connection.connection.host}`.green.bold);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports=connectDB;