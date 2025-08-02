const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPTOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index=async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
}
module.exports.newListing=(req, res) => {
    res.render("listings/new");
}
module.exports.addNewListing=async (req, res) => {
   let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  .send()
  
  console.log(response.body.features[0].geometry.coordinates);
  
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image={url,filename}
    newListing.owner = req.user._id; 
    newListing.geometry=response.body.features[0].geometry;
    let news=await newListing.save();
    console.log(news);
    req.flash('success',"New Listing Created");
    res.redirect("/listings");
}
module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Doestnot exists");
        return res.redirect("listings");
    }
    originalUrl=listing.image.url;
   // console.log(originalUrl);
    originalUrl=originalUrl.replace("/upload","/upload/h_250,w_250");
    //console.log(originalUrl);
    res.render("listings/edit.ejs", { listing ,originalUrl});
}
module.exports.show=async (req, res) => {
    let { id } = req.params;
   const listing = await Listing.findById(id)
  .populate({
    path: "review",
    populate: {
      path: "author"
    }
  })
  .populate("owner");


    console.log("Listing owner:", listing.owner);

    if (!listing) {
        req.flash("error", "Listing Not found");
        return res.redirect("/listings");  
    }

    res.render("listings/show", { listing });
}
module.exports.update=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if( typeof req.file !=="undefined"){
         let url=req.file.path;
         let filename=req.file.filename;
         listing.image={url,filename};
         await listing.save();
    }
    

    if (!listing) {
        req.flash("error", "Cannot update, listing not found");
        return res.redirect("/listings");
    }
    req.flash('success','Listing Updated');
    res.redirect(`/listings/${id}`);
}
module.exports.destroy=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
        req.flash("error", "Cannot delete, listing not found");
        return res.redirect("/listings");
    }
    req.flash('success',"Listing Deleted");
    res.redirect("/listings");
}
// module.exports.logout=async(req,res,next)=>{
//    req.logout((err)=>{
//     return next(err);
//    })
//    req.flash("success","Succesfully You loggout");
//    res.redirect("/listings")
//}/