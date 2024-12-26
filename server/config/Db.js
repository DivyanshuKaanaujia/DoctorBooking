import mongoose from "mongoose"

function connectDb(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to Db")
    }).catch((err)=>{
        console.log("Error while connecting to the Database:",err)
    })
}

export default connectDb;