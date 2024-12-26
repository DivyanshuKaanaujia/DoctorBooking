import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/Db.js"
import routes from "./routes/index.js"

const app = express();
dotenv.config({path:"./config/variables.env"})
app.use(express.json())

connectDb()

app.use("/",routes)

const port = process.env.PORT||3000;
app.listen(port,()=>{
    console.log(`Server running on port:${port}`)
})