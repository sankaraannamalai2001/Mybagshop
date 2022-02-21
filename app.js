const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const router=express.Router();
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate')
const {isLoggedin}=require("./views/middleware");
const ExpressError=require("./utils/Expresserror");
// const dbConnection=require("./utils/mongodbconnect");

// dbConnection.dbConnection();
const MongoStore = require('connect-mongo');
const User=require('./models/userModel');
const Item=require('./models/itemModel');

const flash=require('connect-flash');
const app = express();
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(methodOverride('_method'));


const userRoutes=require('./routes/user')
const itemRoutes=require('./routes/item')
const sessionConfig = {
  
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.Currentuser=req.user;
    next();
})

app.use('/',userRoutes);
app.use('/',itemRoutes);

app.get('/home', isLoggedin,(req, res) => {
    res.render('index');
});
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500,}=err;
    if(!err.message){
        error.message="Something went Wrong :(";
    }
    return res.status(statusCode).render('error',{err});

})

app.listen(5000,() => {
    console.log('Serving on port 5000')
})