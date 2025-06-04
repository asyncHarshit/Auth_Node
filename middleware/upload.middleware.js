import multer from "multer";
import path from 'path';

// set our multer storage 

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null , "uploads/")
    },
    filename : function(req,file,cb){
        cb(null , 
            file.fieldname + '-' + Date.now() + path.extname(file.originalname) 
        )
    }
});

// file filter function to check file type

const checkFileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new Error("Only image files are allowed"),)
    }
}

// 

export default multer({
    storage : storage,
    fileFilter : checkFileFilter,
    limits : {
        fileSize : 1024 * 1024 * 5 
    }
})