import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import authRoutes from './routes/auth.route.js'

const app = express();

dotenv.config();
const port = process.env.PORT

connectDB()
// middleware
app.use(express.json());

app.use('/api/auth',authRoutes)
app.listen(port , ()=>{
    console.log(`Server is running on ${port}`);
    
})