var express = require('express');
var router = express.Router();
var users = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user != undefined)
  	res.redirect('/');
  else 
  	res.render('login');

});

router.post('/',(req,res,next) => {
if (req.session.user != undefined)
  	res.redirect('/');
else{
  var allUsers = [];
  var name = req.body.name;
  var password = req.body.password;
  var cursor = users.find({name:name}).cursor();
  cursor.on('data',(doc) => {
  	allUsers.push(doc);
  });
  cursor.on('close',()=>{
  	if (allUsers.length == 0)
  	  res.send('authentication failure',400);
  	else if(allUsers[0].password == password){
		req.session.user = name;
    req.session.c = 0;
		res.redirect('/');
	}
	else 
		res.send('authentication failure',400);
	});
	}
});


module.exports = router;
