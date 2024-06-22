const moongose = require('mongoose');


const userSchema = new moongose.Schema({
    googleId:{
        type: Number,
    },
    email : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    picture : {
        type : String
    },
    refreshToken : {
        type : String
    }
},{
    timestamps : true
})

const User = moongose.model('Persons', userSchema);

module.exports = User;
