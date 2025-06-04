import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (filePath)=>{
    try {

        const result = await cloudinary.uploader.upload(filePath);
        return {
            url : result.secure_url,
            publicId : result.public_id
        }
        
    } catch (error) {
        console.log("Error uploding to cloudinary in helper" , error);
        throw new Error("Failed to upload to cloudinary")
        
        
    }
}

export {uploadToCloudinary};
            