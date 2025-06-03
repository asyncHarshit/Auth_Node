import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

// register Controller 
const registerUser = async(req , res)=>{
    try {
        // extract user information form our request Body
        const {username , email , password , role} = req.body;

        // chack if user already exist or not
        const checkExistingUser = await User.findOne({$or : [{username} , {email}]})
        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : "user already exist !! "
            })
        }
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        // created new user and save to database

        const newlyCreatedUser = new User({
            username,
            email,
            password : hashedPassword,
            role : role || 'user'
        })

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                message : "User created sucessfully",
                success : true,
                data : newlyCreatedUser
            })
        }else{
            res.status(400).json({
                message : "Unable to register User",
                success : true
            })
            
        }


        
    } catch (error) {
        res.status(500).json({
            message : "Error in register User in auth controller"
        })
        console.log(error);
        
        
    }
}

// login controoller    

const loginUser = async(req , res)=>{
    try {

        const {password , username} = req.body;
        // finnd if user exist or not
        const user = await User.findOne({username});
       
        if(!user){
            res.status(400).json({
                message : "Invalid Credentials !!",
                success : false
            })
        }

        // check if Password is correct or not

        const isPasswordMatch = await bcrypt.compare(password , user.password);
        if(!isPasswordMatch){
            res.status(400).json({
                message : "Invalid Credentials !!",
                success : false
            })
        }

        // Creating JWT token
        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role : user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn : '15m'
        })

        res.json({
            message : "Logged in sucessfully",
            success : true,
            accessToken
        })
 

        


        
    } catch (error) {
        res.status(500).json({
            message : "Error in login User in auth controller"
        })
        console.log(error);

        
    }
}

export {registerUser , loginUser}