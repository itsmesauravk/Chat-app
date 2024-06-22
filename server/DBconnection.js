const mongoose = require('mongoose');
require('dotenv').config();


const connection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log('Connected to database');
    } catch (error) {
        console.log('Error connecting to database');
        console.log(error);
    }
    }


module.exports = connection;