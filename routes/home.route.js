import express from 'express'
import authMiddleware from '../middleware/auth.middleware.js';


const router = express.Router();

router.get('/welcome',authMiddleware , (req,res)=>{
    const { userId, username, role } = req.userInfo;
    res.json({
        message : "Welcome to home page",
        user : {
            _id : userId,
            username,
            role
        }
    })
});


export default router;