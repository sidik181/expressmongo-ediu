const mongoose = require('mongoose');
const devDbUrl = "mongodb+srv://sidik:password123!@productsv2.vkwxizw.mongodb.net/?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || devDbUrl;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDB, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports = connectDB;
