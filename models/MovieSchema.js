const mongoose=require("mongoose")

const schema=mongoose.Schema({
    name:{
        type:String,
        require
    },
    release:{
        type:Date,
    },
    plot:{
        type:String,
    },
    poster:String,
    actors:String,
    director:{
        type:String
    }
})
module.exports=mongoose.model('Movie',schema);