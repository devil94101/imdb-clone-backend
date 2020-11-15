var router=require('express').Router()
var UserSchema=require('../models/UserSchema')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const auth=require('../middleWare/auth')


router.get('/',auth,async(req,res)=>{
    res.send({
        err:false,
        details:req.user
    })
})
router.get('/auth',auth,(req,res)=>{
    res.send({
        err:false,
        name:req.user.name
    })
})
router.post('/login',async(req,res)=>{
    let {email,password}=req.body;

    try{
        const user=await UserSchema.findOne({email});
        if(!user){
            return res.json({
                err:true,
                msg:"email is incorrect"
            })
        }
        const isEqual=await bcrypt.compare(password,user.password)
        if(!isEqual){
            return res.json({
                err:true,
                msg:"Incorrect Password"
            })
        }
        const payload={
            id:user._id,
            name:user.name
        }
        jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:36000
        },(err,token)=>{
            if(err)throw err
            res.json({
                token,
                name:user.name
            })
        })
    }   
    catch(err){
        console.log(err.message);
        res.send({
            err:true,
            msg:"server error"
        });
    }
})
router.post('/register',(async(req,res)=>{
    let {name,email,password}=req.body;
    try{
       
        let user=await UserSchema.findOne({email})
        if(user){
            return(res.json({
                err:true,
                msg:"email already exist"
            }))
        }
        const salt=await bcrypt.genSalt(10);
        password=await bcrypt.hash(password,salt)
        user=new UserSchema({
            name,email,password
        })
        await user.save()
        const payload={
            user:{
                id:user._id,
                name:user.name
            }
        }
        jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:360000
        },(err,token)=>{
            if(err)return(console.log(err))
            res.json({token,
            name:user.name})
        }); 
    }
    catch(err){
        res.send({
            err:true,
            msg:"server error"
        });
    }
}))
module.exports=router