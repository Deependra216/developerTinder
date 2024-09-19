// const URI=
const mongoose =require('mongoose');

//connect to cluster
const connectDB =async ()=>{
    await mongoose.connect("mongodb+srv://admin:deep123@cluster0.dppqum9.mongodb.net/devTinder")
};
module.exports = connectDB; 