const Person = require('../schema/users');
const jwt = require('jsonwebtoken');


//login via email

const loginUser = async (req, res) => {
    try {
        const {email} = req.body;
        if(!email){
            return res.status(400).json({success:false, message:"Please provide email."})
        }
        const user = await Person.findOne({email});
        // console.log(user)

        const googleId = user.googleId;
        console.log(googleId)
        if(!user){
            return res.status(404).json({success:false, message:"User not found."})
        }
        const accessToken = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'});
        const refreshToken = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, {
            httpOnly:true, 
            secure:true,
            sameSite:'none'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly:true,
            secure:true,
            sameSite:'none'
        });
        res.cookie('googleId', googleId, {
            httpOnly:true,
            secure:true,
            sameSite:'none'
        }
        )

        res.status(200).json({success:true, message:"User logged in.", googleId, accessToken, refreshToken})
    }catch (err) {
        res.status(500).json({success:false, message: "Internal server Error.", error:err });
    }
}




// get profile

const getProfile = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await Person.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// get users
const getUsers = async(req,res)=>{
    try {
        
        const id = req.user.id
       

        const users = await Person.find({
            _id: {
                $ne:id   // $ne = not equal to
            }
        })
        if(!users){
            res.status(404).json({success:false, message:"Cannot get users."})
        }
        if(!users.length > 0){
            res.status(400).json({success:false, message:"No users available."})
        }
        res.status(201).json({success:true, message:"User available.", users})

    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, message:"Internal server error", error})
    }
}

//logout

// Logout route
const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('googleId');
    res.status(200).json({
        success: true,
        message: 'Logged out' });
  };


module.exports = {
    getProfile,
    getUsers,
    loginUser,
    logout
};
