const  mongoose  = require("mongoose");
const validator =require('validator')
const jwt =require('jsonwebtoken')
const bcrypt =require('bcryptjs')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email address not valid: " + value)
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enetr Strong  Password: " + value)
            }
        },
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        lowercase:true,
        validate(value){
        if(!['male','female','others'].includes(value)){
            throw new Error("Gender not vaild!!")
        }
    }
},
    photoUrl:{
        type:String,
        default:"http://dummy.com/1.jpg",
    },
    about:{
        type:String,
        default:"Default Value of user"
    },
    skills:{
        type:[String]
    }

},{
    timestamps:true
})

userSchema.methods.getJWT = async function () {
    const user =this;
    const token = await jwt.sign({_id:user._id},"DevTinder@112",{expiresIn:"1h"

});
return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user= this;
    const hashPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,hashPassword);

    return isPasswordValid;
}


module.exports = mongoose.model("User",userSchema)