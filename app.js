//requiring node modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const flash = require('connect-flash');



//requiring routes
const authRout = require('./Routes/authRout');
const homeRout = require('./Routes/homeRout');


//requiring model
const User = require('./Models/userModel');


// connecting to database
mongoose.connect('mongodb://localhost:27017/delta2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const app = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



const sessionConfig = {
    secret : 'thisisasecret',
    resave : false,
    saveUninitialized:false
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})



passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', async(req,res)=>{

    res.redirect('/login');

})



//using routes
app.use(authRout);
app.use(homeRout);



app.listen(3000, () => {
    console.log('Serving on port 3000');
})