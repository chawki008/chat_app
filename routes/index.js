var express = require('express');
var router = express.Router();
var users = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user != undefined)
  	res.redirect('/chatroom');
  else{
  	var allUsers =[];
  	//users.remove({},(err)=>{console.log(err);});
  var cursor = users.find().cursor();
  cursor.on('data',(doc) => {
  	allUsers.push(doc);
  });
  cursor.on('close',()=>{
  	allUsers.forEach((e) => {})
  res.render('index', { user: req.session.user });
	});
	}
});



module.exports = router;
