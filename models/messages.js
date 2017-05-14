var mongoose = require('mongoose'); 
var message = new mongoose.Schema({content:String , creator:{type: mongoose.Schema.ObjectId , ref : 'users'}});
var messages = mongoose.model('messages',message);
module.exports = messages;