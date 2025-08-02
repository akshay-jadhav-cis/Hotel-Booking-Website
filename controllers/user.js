const User = require("../models/user");

module.exports.signup = (req, res) => {
  res.render("users/signup");
}

module.exports.signupAdd = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const newUser = new User({ username, email }); 
    const registeredUser = await User.register(newUser, password); 
    
    // Optional: log the user in after registering
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Successfully Logged In");
      res.redirect("/listings");
    });

  } catch (err) {
    req.flash("error", "Username already exists");
    res.redirect("/signup");
  }
}
const passport = require("passport");

module.exports.login = (req, res) => {
  res.render("users/login");
}

module.exports.loginAdd = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect(res.locals.redirect || "/listings");
    });
  })(req, res, next);
};