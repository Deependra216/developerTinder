const adminAuth=(req,res,next)=>{
    const token="xyzm";
    const isAdminAuth= token ==='xyz';
    if(!isAdminAuth){
        res.status(401).send("Unauthorized")
    }
    else{
        next()
    }
}

const userAuth=(req,res,next)=>{
    console.log("User auth Checked!!!")
    const token="xyzmn";
    const isAdminAuth= token ==='xyzm';
    if(!isAdminAuth){
        res.status(401).send("Unauthorized")
    }
    else{
        next()
    }
}
module.exports ={
    adminAuth,
    userAuth
}