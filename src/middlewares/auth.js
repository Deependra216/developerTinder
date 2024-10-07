const jwt =require('jsonwebtoken');
const User = require('../models/user');
// const adminAuth=(req,res,next)=>{
//     const token="xyzm";
//     const isAdminAuth= token ==='xyz';
//     if(!isAdminAuth){
//         res.status(401).send("Unauthorized")
//     }
//     else{
//         next()
//     }
// }

// const userAuth=(req,res,next)=>{
//     console.log("User auth Checked!!!")
//     const token="xyzmn";
//     const isAdminAuth= token ==='xyzm';
//     if(!isAdminAuth){
//         res.status(401).send("Unauthorized")
//     }
//     else{
//         next()
//     }
// }

const userAuth=async(req,res,next)=>{
    try{
        //Read the token from the req.cookies
    const cookies =req.cookies;
    const {token} = cookies;
    if(!token){
       return res.status(401).send("Please Login First!!")
    }
    const decodedToken = await jwt.verify(token,"DevTinder@112")
    console.log(decodedToken)
    //validate the token
    
    const {_id} = decodedToken;
    const userData = await User.findById(_id)
    //Find the user
    if(!userData){
        throw new Error("user not found!!")

    }
    req.user =userData;
    next();
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
}


module.exports ={    
    userAuth
}