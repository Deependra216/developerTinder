const  mongoose  = require("mongoose");

const connectionRequestSchema= new mongoose.Schema({
    //sender
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    //receiver
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    //request status
    status:{
        type:String,
        required:true,
        //enum for just stick for certai values
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect as type`
        },

    }

},{ timestamps:true} )
//cannot send req to yourself
connectionRequestSchema.pre("save",function( next ){
    const connectionRequest =this;
    //check if fromUserId is same as to toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself!!")
    }
    next();
})
//////////////////////////////////////////////////////

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel;