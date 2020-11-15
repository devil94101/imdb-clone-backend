var router=require('express').Router()
var axios=require('axios')
var MovieSchema=require('../models/MovieSchema')
var ActorSchema=require('../models/ActorSchema')
var ProducerSchema=require('../models/ProducerSchema')
 
router.get('/',async(req,res)=>{
    const str="baka"
    var re=new RegExp(`\\b${str}\\b`)
    const y=await MovieSchema.find({ "name" : { $regex: re, $options: 'i' }})
    res.send(y)
})
router.get('/search/:query',(req,res)=>{
    axios.get(`http://www.omdbapi.com/?apikey=c774b229&s=${req.params.query}`).then((data)=>{
     const str=req.params.query
    var re=new RegExp(`\\b${str}\\b`)
        MovieSchema.find({ "name" : { $regex: re, $options: 'i' }},(err,x)=>{
            if(err){
                throw err
            }
            else{
                var xx=data.data
                var yy=x.map(ele=>{
                    return{
                        Title:ele.name,
                        Year:ele.release,
                        imdbID:ele._id,
                        Poster:ele.poster
                    }
                })
                res.json([...xx.Search,...yy])
            }
        })

    }).catch(err=>{
        console.log(err.message)
        res.send({
            err:true,
            msg:"server error"
        });
    })
})
router.get('/detail/:id',(req,res)=>{
    // console.log(req.params)
    axios.get(`http://www.omdbapi.com/?apikey=c774b229&i=${req.params.id}`).then(async (data)=>{
        console.log(data.data)
        if(data.data.Error){
            const x=await MovieSchema.findById(req.params.id) 
            res.json({
                Title:x.name,
                Year:x.release,
                imdbID:x._id,
                Poster:x.poster,
                Actors:x.actors,
                Released:x.release.toDateString(),
                Director:x.director,
                Plot:x.plot
            })
        }
        else{
            res.json(data.data)
        }
    }).catch(err=>{
        console.log(err.message)
        res.send({
            err:true,
            msg:"server error"
        });
    })
})
router.post('/addMovie',async(req,res)=>{
    console.log(req.body)
    var obj = { 
        ...req.body, 
        actors:req.body.actors.toString()
    } 
    const x=new MovieSchema(obj)
    try{
        await x.save()
    }
    catch(err){
        console.log(err)
    }
    res.json(x)
})
router.post('/addActor',async(req,res)=>{
    // console.log(req.body)    
   try{
    const x=new ActorSchema(req.body)
    await x.save()
    res.send(x)
   }
   catch(err){
       console.log(err.message)
   }
    
})
router.post('/addDirector',async(req,res)=>{
    console.log(req.body)    
   try{
    const x=new ProducerSchema(req.body)
    await x.save()
    res.send(x)
   }
   catch(err){
       console.log(err.message)
   }
    
})
router.get('/actors',async(req,res)=>{
    let x=await ActorSchema.find({})
    let d=await ProducerSchema.find({})
    x=x.map(ele=>ele.name)
    d=d.map(ele=>ele.name)
    res.send({
        actors:x,
        directors:d
    })
})
module.exports=router
