const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const USER_SAFE_DATA = [ "firstName","lastName","gender","age","photoUrl","skills"] 
//find all pending connections requests for loggedIn user
userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
try{
    const loggedInUser = req.user;
    //find will return array
    const connectionRequest= await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status:"interested"
    }).populate("fromUserId",["firstName","lastName","gender","photoUrl","about","skills"])
    // console.log(loggedInUser)
    res.json({message:"data fetched successfully",data:connectionRequest})

}catch(err)
{
    req.statusCode(400).send("ERROR: " + err.message);
    console.log(err)
}
})

//see all connection requests
userRouter.get('/user/connections',userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId :loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"}
            ]

        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        console.log(connectionRequest)

        const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        console.log("same Id",data)
        res.json({data})
    }catch(err){
        res.status(400).send({message: err.message})
    }
})

module.exports = userRouter;