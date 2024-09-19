const express =require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const {validateEditProfileData} = require('../helpers/validation')
const User =require('../models/user')

router.get('/profile/view',userAuth,async(req,res)=>{
    try{
            const user = req.user
            res.send(user)
         }
        catch(err){
            res.status(400).send("ERROR: "+ err.message)
        }
    })


router.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request!!!")
        }

        const loggedInUser =req.user
         Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
         await loggedInUser.save();
         res.json({message:`${loggedInUser.firstName}, your Profile Edit Successfully!!`,data:loggedInUser})
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

router.patch('/profile/password',(req,res)=>{})
module.exports= router;