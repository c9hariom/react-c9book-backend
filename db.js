const mongoose = require("mongoose");

const mongoURI = 'mongodb://localhost:27017/c9book';

const connectToMongo = async()=>{
    if(mongoose.connect(mongoURI)){
        console.log("Connected To Mongo DB Successfully.")
    } else {
        console.log("Connection To MongoDB is faield.");
    }
}

module.exports = connectToMongo;