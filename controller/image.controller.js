import Image from "../models/Image.js";
import { uploadToCloudinary } from "../helpers/cloudinaryHelper.js";
import fs from 'fs'
import cloudinary from "../config/cloudinary.js";


const uploadImageController = async(req , res)=>{
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

const fetchImageController = async(req,res)=>{
    try {

        const images = await Image.find({});
        if(images){
            res.status(201).json({
                data : images,
                success : true
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong in fetch Image Controller",
            success : false
        })

        
    }


}

const deleteImageController = async(req,res)=>{
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if(!image){
            return res.status(400).json({
                message : "Image not found",
                success : false
            })
        }
        
        // check if this image is uploaded by current user who wants to delete this image

        if(image.uploadedBy.toString() !== userId){
            return res.status(400).json({
                success : false,
                message : "You are not authorise to delete this image"
            })
        }

        // delete from cloudinary

        await cloudinary.uploader.destroy(image.publicId)


        // delete from moongo db

        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            message : "Image deleted successFully",
            success : true
        })






        
    } catch (error) {
        res.status(500).json({
            message : "Something went wrong in deleteImageController",
            success : false
        })
        
    }
}


export { fetchImageController , uploadImageController,deleteImageController}