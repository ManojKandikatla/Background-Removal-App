import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/UserRoutes.js";

//app config
const PORT = process.env.PORT || 4000;
const app = express()
await connectDB()


// initialize middlewares
app.use(express.json())
app.use(cors())

//api routes
app.get('/',(req,res)=>res.send("API is Working"))
app.use('/api/user',userRouter)

app.listen(PORT,()=>console.log("server running on port "+PORT)
)




//npm install express cors dotenv nodemon form-data jsonwebtoken mongoose multer axios svix razorpay these are the packages used in backend