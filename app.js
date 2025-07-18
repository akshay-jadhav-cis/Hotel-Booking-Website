const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{console.log("Database Connection Successfully")}).catch(err=>{console.log(err)});
async function main() {
    mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.listen(8080,()=>{console.log("Port is Listening at 8080")});
app.get("/",(req,res)=>{
    res.send("<h1>Hone Page<\h1>");
})
app.get("/listings",async(req,res)=>{
  const allListing=await Listing.find({});
    res.render("listings/index",{ allListing });
})
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new");
})
app.get("/listings/:id/edit",async(req,res)=>{
    let { id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})
app.get("/listings/:id",async(req,res)=>{
    let { id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing});
})
app.put("/listings/:id",async(req,res)=>{
    let { id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings")
})
app.delete("/listings/:id",async(req,res)=>{
    let { id}=req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted");
    //alert("Lsiting deleted");
    res.redirect("/listings")
})

app.post("/listings",async(req,res)=>{
    console.log(req.params.listing);
    let newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})
