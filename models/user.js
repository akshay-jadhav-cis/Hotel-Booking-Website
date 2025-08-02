const mongoose=require("mongoose");
const {Schema}=mongoose;
const localpassportmongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})
userSchema.plugin(localpassportmongoose);
module.exports=mongoose.model('User',userSchema);