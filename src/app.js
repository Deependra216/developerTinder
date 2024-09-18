const express= require('express')
const app= express();

app.use((req,res)=>{
    res.send("hello from server...")
})
app.listen(7000,()=>{
    console.log("server is successfully running on port 6000 ")
});
