const Person = require('../schema/users');
const jwt = require('jsonwebtoken');



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

//logout

// Logout route
const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: 'Logged out' });

  };


module.exports = {
    getProfile,
    logout
};
