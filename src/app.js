const express= require('express');
const app= express();
const connectDB = require('./config/database');
const {validateSignUp}= require('./helpers/validation')
const bcrypt =require('bcryptjs')
const cookieParser=require('cookie-parser')
const jwt =require('jsonwebtoken')
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')

app.use('/',authRouter);
app.use('/',profileRouter)
app.use('/',requestRouter)


const port=7000;
connectDB().then(()=>{
    console.log("Database Connection Successfull!!")
    app.listen(port,()=>{
        console.log("server is successfully running on port: ", `${port}` )
    });
    
}).catch((err)=>{
    console.log("Database Connection Failed")
})
