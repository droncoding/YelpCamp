if ( process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const Campground = require("./models/campground");
const Review = require("./models/review");
const bodyParser = require("body-parser");
const Joi = require("joi");
const { campgroundSchema,reivewSchema } = require('./schemas');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const mongoSanitize = require('express-mongo-sanitize');

const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

mongoose.connect("mongodb://localhost:27017/yelp-camp", { 
useUnifiedTopology: true,
useNewUrlParser: true,
useFindAndModify: false});
mongoose.set('useCreateIndex', true);

//cehck if db is connected
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DB connected");
});

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
// app.set('views', path.join(__dirname,'views'))

app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(mongoSanitize());


const validateCampground = (req,res,next)=>{
    
    const { error } = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    const { error } = reivewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

const sessionConfig = {
    name: 'session',
    secret:'Justasmallsecret',
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires: Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

app.use((req,res,next)=>{

    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);




passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",(req,res)=>{
    res.render("home")
})




app.all("*",(req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err,req,res,next)=>{
    const { statusCode = 500} = err;
    if (!err.message) err.message = 'Something went wrong' 
    res.status(statusCode).render('error',{err})
})

app.listen(3000,()=>{
    console.log("Server is listening on Port 3000");
})