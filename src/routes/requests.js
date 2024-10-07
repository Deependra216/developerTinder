const express =require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User =require('../models/user')

router.post('/request/send/:status/:toUserId',userAuth,async(req,res)=>{
    //send Connection Request
    try{
        console.log(req.user)
        const fromUserId= req.user._id;
        const toUserId = req.params.toUserId;
        const status= req.params.status

        //allowed this api for interested or ignore
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+ status})
            //using return will code not go further
        }

    //if user not exists in DB!!
    const toUser = await User.findById(toUserId);
    if(!toUser)
    {
        return res.status(404).json({message:"User not Found!!"})
    }


    //if connection Request already exists!!
    const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
            { fromUserId,toUserId},
            { fromUserId:toUserId, toUserId:fromUserId},
        ]
    })

    if(existingConnectionRequest){
        return res.status(400).json({message:"Connection Request Already Sent!!"})
    }
        const connectionRequest = new ConnectionRequest(
            {
                fromUserId,
                toUserId,
                status,
            }
        );

        const connectionData = await connectionRequest.save();

        if(status == "interested"){
            res.json({
                message: req.user.firstName + " is " + status + " in " +toUser.firstName ,
                data:connectionData
            })
        }
        else{
            res.json({
                message: req.user.firstName + " is " + status + " you " +toUser.firstName ,
                data:connectionData
            })
        }
        

    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)
    }
})

// POST /request/send/review/accpeted/:requestId
router.post('/request/review/:status/:requestId',userAuth,async(req,res)=>{
    try{
        console.log("qwerty"+req.user)
        const loggedInUser = req.user
        //deependra=> virat
        //loggedInId = toUserId
        //status = interested
        const {status,requestId} =req.params;
        

        //allowed this api for interested or ignore
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+ status})
            //using return will code not go further
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId, // this is connectionRequest Id from db
            toUserId:loggedInUser._id, //this toUserId like virat
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection Request not found: "})
            
        }

        connectionRequest.status = status
        const data= await connectionRequest.save();
        res.json({message: "Connection Request : "+status,data})
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message)

    }
})


router.post('/request/send/review/rejected/:fromRequestId',userAuth,async(req,res)=>{
    //send Connection Request
    const user=req.user
    console.log("send Connection Request");
    res.send(user.firstName + " send the Connection Request")
})
module.exports =router