require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session=require("express-session");
const cookieParser=require("cookie-parser");
const flash=require('connect-flash');
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const router = require("./router/router.js");
const reviewRouter = require("./router/review.js");
const userRouter=require("./router/userrouter.js")
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require('passport-local');

const sessionOption={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
const MONGO_URL = process.env.MONGOURL;
//const db_url=process.env.ATLASTOKEN;
async function main() {
     await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("Database Connection Successfully"))
    .catch(err => console.log(err));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});


app.use("/listings", router);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
// app.all("*", (req, res, next) => {
//     next(new ExpressError("Page not found", 404));
// });


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("listings/error", { err });
});
app.listen(8080, () => {
    console.log("Port is Listening at 8080");
});
