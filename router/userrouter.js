const express = require("express");
const router = express.Router();
const {saveRedirectUrl}=require("../middleware")
const passport=require("passport");
const userController=require("../controllers/user");
// router.get("/signup",userController.signup );
const {isLoggedIn}=require("../middleware")
router.route("/signup").get(userController.signup ).post(userController.signupAdd);
router.route("/login").get( userController.login).post(saveRedirectUrl,userController.loginAdd);
// router.get("/login", userController.login);
// router.post("/login",saveRedirectUrl,userController.loginAdd)
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Successfully logged out");
    res.redirect("/listings");
  });
});
module.exports = router;
