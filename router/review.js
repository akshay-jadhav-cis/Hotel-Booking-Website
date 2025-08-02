const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/review.js");

const { isLoggedIn, isReviewOwner, validateReview } = require("../middleware.js");

// Add Review - only logged in users
reviewRouter.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview)
);

// Delete Review - only owner of review
reviewRouter.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewOwner,
  wrapAsync(reviewController.deleteReview)
);

module.exports = reviewRouter;
