const express=require("express")
const app=express();
const colors=require("colors")
const cors=require("cors");
const useRouter=require("./router/useRouter")
const connectDB = require( "./config/db" );
require("dotenv").config()

const port=process.env.PORT;
connectDB();
app.use(express.json());


app.use("/authuser",useRouter)






app.listen(port,()=>{
    console.log(`Server live at ${port} `.yellow.bold)
})



