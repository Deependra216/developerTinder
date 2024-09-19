const express= require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');
const app= express();

const connectDB = require('./config/database');
const User = require('./models/user');
const port=7000;

app.post("/signup",async (req,res)=>{
    //creating a new instance of the User model
    const user = new User ({
        firstName:"deependra",
        lastName:"singh",
        emailId:"deep@gmail.com",
        password:"deep123"
    })

    await user.save();
    res.send("User Added Successfully!!")

})


connectDB().then(()=>{
    console.log("Database Connection Successfull!!")
    app.listen(port,()=>{
        console.log("server is successfully running on port: ", `${port}` )
    });
    
}).catch((err)=>{
    console.log("Database Connection Failed")
})
