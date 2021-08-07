const { campgroundSchema,reivewSchema } = require('./schemas');
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");


module.exports.isLoggedIn = (req,res,next)=>{
    if(! req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','Please log in!');
        return res.redirect("/login");
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    
    const { error } = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(! campground.author.equals(req.user._id)){
        req.flash("error","You dont have the permission!");
        res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}

module.exports.validateReview = (req,res,next)=>{
    const { error } = reivewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}