import express from 'express';
import { changePassword, loginUser , registerUser } from '../controller/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router()


    router.post('/register' , registerUser),
    router.post('/login',loginUser),
    router.post('/change-password',authMiddleware,changePassword)









export default router