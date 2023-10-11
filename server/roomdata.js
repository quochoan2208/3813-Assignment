const { Int32, Double } = require('mongodb');
const mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/mydb';
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> {
    console.log("Successfully connected")
}).catch((err)=>{
    throw err
});
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;



  const roomSchema = new mongoose.Schema({
    id: Number,
    name: String,
    channels: [String],
    users: [Number],
  });
module.exports = mongoose.model('rooms',roomSchema); 
