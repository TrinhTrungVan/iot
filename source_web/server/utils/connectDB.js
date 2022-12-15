const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://TrungVan1904:TrungVan1904@mycluster.96efpsw.mongodb.net/TemperHumid";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
