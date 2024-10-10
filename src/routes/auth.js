const express =require('express');
const router = express.Router();
const User = require('../models/user');
const {validateSignUp} = require('../helpers/validation')
const bcrypt =require("bcryptjs")

router.post("/signup",async (req,res)=>{
    // console.log(req.body)
    //validate the data
    try{
    validateSignUp(req);
    //Encrypt the password
    const {firstName,lastName,emailId,password,gender,skills} =req.body;
    const hashPassword = await bcrypt.hash(password,10);
    console.log(hashPassword)
    
    //creating a new instance of the User model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:hashPassword,
        gender,
        skills
    })        
        const savedUser = await user.save();
        const token = await  savedUser.getJWT()
        res.cookie("token",token,{expires: new Date(Date.now() + 2 * 3600000)})
        res.json({message:"User Added Successfully!!",data:savedUser})
}
catch(err){
    res.status(400).send("Error: "+err.message);
}
})

//login API
router.post("/login",async(req,res)=>{
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Email ID not Found!!")
        }  

        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){
            const token = await  user.getJWT()
            console.log(token)
            //add the token to cookie and send resopnse back to user 
            res.cookie("token",token,{expires: new Date(Date.now() + 2 * 3600000)})
            res.send(user)
        }
        else{
            throw new Error("Password Not Valid!!")
        }
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})

router.post("/logout", async (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Loggout Successfully!!")

})

module.exports= router;