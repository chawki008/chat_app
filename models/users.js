var mongoose = require('mongoose'); 
var db = mongoose.connect('mongodb://chawki008:84835484@ds064299.mlab.com:64299/chat_01');
var user = new mongoose.Schema({name:String , password:String});
var users = db.model('users',user);
module.exports = users;