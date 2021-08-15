const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const router = express.Router();
const Campground = require("../models/campground");

const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const catchAsync = require("../utils/catchAsync");


router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


router.get("/new",isLoggedIn,campgrounds.renderNewForm)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;