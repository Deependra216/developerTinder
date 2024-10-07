const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

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

//user sholud see all others cards except
//0. his own card
//1. his connections 
//2. ignored people
//3. already sent the connection request to someone

userRouter.get('/feed',userAuth,async(req,res)=>{
    try{
        const loggedInUser =req.user;
        //store pagination number dynamically
        const page = parseInt(req.query.page) || 1; //it give result like 1 or 2 and if not then assume 1
        let limit =parseInt(req.query.limit) ||10;
        limit = limit > 50 ? 50: limit;

        const skip = (page-1)*limit
        //find all the connection request(send ,received)
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")
       
        
        //using new Set() it will just add all values in array but not add duplicate value like add A, B, C, A here Awill not add again
        const hideUserFromFeed = new Set();
        connectionRequest.forEach( req =>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })
       
        //find all the people whose id not in hideUserFromFeed

        const users = await User.find({
            $and:[
                {_id: { $nin:Array.from(hideUserFromFeed)},},
                {_id: { $ne:loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({message:"data of User",data:users,})
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports = userRouter;