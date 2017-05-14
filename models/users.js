var mongoose = require('mongoose'); 
var db = mongoose.connect('mongodb://127.0.0.1/db');
var user = new mongoose.Schema({name:String , password:String});
var users = db.model('users',user);
module.exports = users;