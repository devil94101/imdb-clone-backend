const mongoose=require("mongoose")

const schema=mongoose.Schema({
    name:{
        type:String,
        require
    },
    gender:{
        type:String,
        require
    },
    dob:{
        type:Date,
        require
    },
    bio:{
        type:String
    }
})
module.exports=mongoose.model('Actor',schema);