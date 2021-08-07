const express = require("express");
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview } =require("../middleware")

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");



router.post('/',validateReview, catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','You successfully created new review');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId',catchAsync(async(req,res)=>{
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','You deleted the review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;