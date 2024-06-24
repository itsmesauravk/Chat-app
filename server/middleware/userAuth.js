
const jwt = require('jsonwebtoken')

const userAuth = (req, res, next) => {
    const token = req.cookies.accessToken;
    if(!token){
        return res.status(404).json({success:false, message:"Token Not Found."})
    }
    jwt.verify(token,process.env.JWT_SECRET, (err, user)=>{
        if(err) return res.status(403).json({success:false, message:"Invalid Token."});
        req.user = user;
        next();
    })
}

module.exports = userAuth