const express = require('express'); 
const router = express.Router();
const passport = require('passport');
const {checkAuth} =require('../middleware/checkAuth');



router.get('/home',async(req,res)=>{
    res.render('home');
})








module.exports = router;