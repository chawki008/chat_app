var mongoose = require('mongoose'); 
var token = new mongoose.Schema({content:String , used : Boolean});
var tokens = mongoose.model('tokens',token);
module.exports = tokens;