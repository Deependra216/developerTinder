const express= require('express');
const { userAuth } = require('./middlewares/auth');
const app= express();
const {validateSignUp}= require('./helpers/validation')
const bcrypt =require('bcryptjs')
const cookies=require('cookie-parser')
const jwt =require('jsonwebtoken')
app.use(express.json())
app.use(cookies())

const connectDB = require('./config/database');
const User = require('./models/user');
const port=7000;

app.post("/signup",async (req,res)=>{
    console.log(req.body)
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
        await user.save();
        res.send("User Added Successfully!!")
}
catch(err){
    res.status(400).send("Error: "+err.message);
}
})

//login API
app.post("/login",async(req,res)=>{
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
            //add the token to cookie and send resopnse bacl to user 
            res.cookie("token",token,{expires: new Date(Date.now() + 2 * 3600000)})
            res.send("Login Successfull!!")
        }
        else{
            throw new Error("Password Not Valid!!")
        }
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})

app.get('/profile',userAuth,async(req,res)=>{
try{
        const user = req.user
        res.send(user)
     }
    catch(err){
        res.status(400).send("ERROR: "+ err.message)
    }
})


app.post('/sendConnectionrequest',userAuth,async(req,res)=>{
    //send Connection Request
    const user=req.user
    console.log("send Connection Request");
    res.send(user.firstName + " send the Connection Request")
})
connectDB().then(()=>{
    console.log("Database Connection Successfull!!")
    app.listen(port,()=>{
        console.log("server is successfully running on port: ", `${port}` )
    });
    
}).catch((err)=>{
    console.log("Database Connection Failed")
})
