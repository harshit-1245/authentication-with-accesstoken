const express=require("express");
const { getUser } = require( "../controllers/userControllers" );
const router=express.Router();

router.route('/').get(getUser)


module.exports=router;

