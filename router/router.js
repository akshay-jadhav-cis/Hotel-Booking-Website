const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudstorage.js");
const upload = multer({storage});

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
// Middleware to validate listing input

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing,isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.addNewListing))

router.get("/new",isLoggedIn,listingController.newListing);
//router.get("/",wrapAsync(listingController.index));
//router.post("/",validateListing,isLoggedIn, wrapAsync(listingController.addNewListing));
router.route("/:id")
    .get( wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.update))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroy));


router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.edit));

// router.get("/:id", wrapAsync(listingController.show));


// router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.update));

// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroy));


module.exports = router;
