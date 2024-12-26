import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/Db.js"

const app = express();
dotenv.config({path:"./config/variables.env"})

connectDb()

const port = process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`Server running on port:${port}`)
})