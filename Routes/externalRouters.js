const express = require('express'); 
const router = express.Router();
const passport = require('passport');
const {checkAuth} =require('../middleware/checkAuth');



const User = require('../Models/userModel');
const Server = require('../Models/serverModel');
const Router = require('../Models/router');




router.get('/api/:server/:router',async(req,res)=>{


    const server = await Server.findOne({name:req.params.server})
    const router = await Router.findOne({name:req.params.router});
    const json = JSON.stringify(router.send);
    res.send(json);




})























module.exports = router;