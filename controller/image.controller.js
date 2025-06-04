import Image from "../models/Image.js";
import { uploadToCloudinary } from "../helpers/cloudinaryHelper.js";
import fs from 'fs'

const uploadImage = async(req , res)=>{
    try {
        //  check if file is missing in req object
        if(!req.file){
            res.status(400).json({
                message : "File is missing to upload",
                success : "false"
            })
        }

        const {url , publicId} = await uploadToCloudinary(req.file.path) ;

        // stored the image url to mongoDB

        const newImageUpload = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId
        })

        await newImageUpload.save();

        // delete the file from local storage
        fs.unlinkSync(req.file.path)

        res.status(404).json({
            message : "Image upload sucessfullu",
            data : newImageUpload,
            success : true
        })
        
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "Something went wrong in image controller"
        })
        
    }
}

export default uploadImage;