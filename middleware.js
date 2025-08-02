// isLoggedIn middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save the original URL the user tried to access
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save redirect URL from session to res.locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
        delete req.session.redirectUrl; // clear it after using
    }
    next();
};
const Listing = require("./models/listing");
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Check if the logged-in user is the owner
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
const { reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
module.exports.validateReview=(req, res, next)=> {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
}
const {listingSchema}=require('./schema');
module.exports.validateListing=(req, res, next)=> {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}
const Review = require("./models/review");

module.exports.isReviewOwner = async (req, res, next) => {
    const { reviewId, id } = req.params; // `id` is listing ID, `reviewId` is review ID
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
