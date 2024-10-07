const express= require('express');
const app= express();
const connectDB = require('./config/database');
const {validateSignUp}= require('./helpers/validation')
const bcrypt =require('bcryptjs')
const cookieParser=require('cookie-parser')
const jwt =require('jsonwebtoken')
const cors = require('cors')
app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,}))
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')
const userRouter = require('./routes/user')


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);



const port=7000;
connectDB().then(()=>{
    console.log("Database Connection Successfull!!")
    app.listen(port,()=>{
        console.log("server is successfully running on port: ", `${port}` )
    });
    
}).catch((err)=>{
    console.log("Database Connection Failed")
})
