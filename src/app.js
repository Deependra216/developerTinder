const express= require('express')
const app= express();

app.use('/admin',(req,res,next)=>{
    const token="xyz";
    const isAdminAuth= token ==='xyz';
    if(!isAdminAuth){
        res.status(401).send("Unauthrized")
    }
    else{
        next()
    }
})
app.get("/admin/getalldata",(req,res,next)=>{
    res.send("All Data Sent..")
    next();
  
})

app.get("/admin/deletealluser",(req,res,next)=>{
    res.send("delete user..")
    
  
})

const port=7000;
app.listen(port,()=>{
    console.log("server is successfully running on port: ", `${port}` )
});
