const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:27017/inotebook";

//Promises syntax

//    mongoose.connect(mongoURI, {
//     useNewUrlParser:true,
//     keepAlive:true
//    }).then(()=>{
//     console.log("you are connected to db");
//    }).catch((err)=>{
//     console.log(err);
//    })

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;

    


