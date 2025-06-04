import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import authRoute from './routes/auth.route.js'
import homeRoute from './routes/home.route.js'
import adminRoute from './routes/admin.route.js'
import uploadImageRoute from './routes/image.route.js'

const app = express();

dotenv.config();
const port = process.env.PORT

connectDB()
// middleware
app.use(express.json());

app.use('/api/auth',authRoute)
app.use('/api/home',homeRoute)
app.use('/api/admin',adminRoute)
app.use('/api/image' , uploadImageRoute)

app.listen(port , ()=>{
    console.log(`Server is running on ${port}`);
    
})