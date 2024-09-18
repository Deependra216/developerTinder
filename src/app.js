const express= require('express')
const app= express();

app.use("/user",(req,res,next)=>{
    console.log("qwerty")
    next();
    res.send("response 1...")
  
},
(req,res,next)=>{
    console.log("qwerty")
    res.send("response 2...")
  
},)
var port=7000;
app.listen(port,()=>{
    console.log("server is successfully running on port: ", `${port}` )
});
