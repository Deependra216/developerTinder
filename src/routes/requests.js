const express =require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');

router.post('/sendConnectionrequest',userAuth,async(req,res)=>{
    //send Connection Request
    const user=req.user
    console.log("send Connection Request");
    res.send(user.firstName + " send the Connection Request")
})

module.exports =router