const express=require("express");
const { getUser, createUser, logInUser, logOut, refreshAccessToken } = require( "../controllers/userControllers" );
const verifyJwt = require( "../middlewares/authentication" );
const router=express.Router();

router.route('/').get(getUser)
router.route('/register').post(createUser)
router.route('/login').post(logInUser)
router.route('/logout').post(verifyJwt,logOut)
router.route('/refreshToken').post(refreshAccessToken)

module.exports=router;

