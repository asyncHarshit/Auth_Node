import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';
import uploadMiddleware from '../middleware/upload.middleware.js';
import { deleteImageController, fetchImageController , uploadImageController } from '../controller/image.controller.js';
const router = express.Router();

// upload image 

router.post('/upload', authMiddleware , adminMiddleware, uploadMiddleware.single('image') , uploadImageController);
router.get('/get',authMiddleware , fetchImageController)

// delete route

router.delete('/:id',authMiddleware , adminMiddleware , deleteImageController);




export default router;