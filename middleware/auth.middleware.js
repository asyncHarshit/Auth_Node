import jwt from 'jsonwebtoken';

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        res.status(401).json({
            message : "No token found",
            success : false
        })
    }
    console.log(authHeader);
    console.log('auth middleware is  called');
    
    // decode this token

    try {
        const decodedToken = jwt.verify(token , process.env.JWT_SECRET_KEY);
        console.log(decodedToken);
        req.userInfo = decodedToken; // attach the decoded token to the request object
        next();
        

        
    } catch (error) {
        res.status(500).json({
            message : "Error in decoded token",
            success : false
        })

        
    }
    
}

export default authMiddleware;