const express = require('express'); 
const router = express.Router();
const passport = require('passport');
const {checkAuth} =require('../middleware/checkAuth');



// require models
const User = require('../Models/userModel');



router.get('/login',async(req,res)=>{
    res.render('authViews/login');   
})


router.get('/register',async(req,res)=>{
    res.render('authViews/register');
})



router.post('/register',async(req,res)=>{
    try{
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registerUser = await User.register(user,password);
        req.flash("success_msg", "Successfully registered, You can Login now!");
        res.redirect('/login');      
    }catch(err){
        console.log(err);
        if(err.message == "A user with the given username is already registered"){
            req.flash("error_msg", "Username already in use! Try again!");
        }
        else if (err.keyValue.email){
            req.flash("error_msg", "This email is already registered! Try again!");
        }
        else {
            req.flash("error_msg", "Sorry! Unable to register");
        }
        res.redirect("/register");        
    }
})



router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    
    res.redirect('/home');
})



router.get('/logout', (req,res)=>{
    try {
        req.logout();
        req.flash("success_msg", "Successfully logged out");
        res.redirect("/login");
        
    } catch (err) {
        req.flash("error_msg", "Unable to logout");
        res.redirect('/home');
    }
})



module.exports = router;