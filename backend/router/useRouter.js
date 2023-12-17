const express=require("express");
const { getUser, createUser, logInUser, logOut } = require( "../controllers/userControllers" );
const verifyJwt = require( "../middlewares/authentication" );
const router=express.Router();

router.route('/').get(getUser)
router.route('/register').post(createUser)
router.route('/login').post(logInUser)
router.route('/logout').post(verifyJwt,logOut)

module.exports=router;

