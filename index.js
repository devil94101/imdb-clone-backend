var express=require('express')
var cors=require('cors')
var app=express()
var mongoose=require("mongoose")
var bodyParser=require('body-parser')
var router=require('./routes/userRouter')
var dotenv=require('dotenv').config()
var movie=require('./routes/movieRoute')
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use("/api",router)
app.use('/movie',movie)
const PORT=process.env.PORT||5000;
const uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify:false,
   useUnifiedTopology: true  }).then(()=>{
       console.log("database connected..")
   }).catch(err=>console.log(err))


app.use((req,res)=>{
    res.send("page not found");
})
app.listen(5000,()=>{
    console.log("listening to port 5000")
})