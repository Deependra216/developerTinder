const  mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        // required:true,
        // minLength:7,
        // maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
})

module.exports = mongoose.model("User",userSchema)