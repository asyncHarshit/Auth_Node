import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

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
        

        
    } catch (error) {
        res.status(500).json({
            message : "Error in login User in auth controller"
        })
        console.log(error);

        
    }
}

export {registerUser , loginUser}