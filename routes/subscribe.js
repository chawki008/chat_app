var express = require('express');
var router = express.Router();
var users = require('../models/users');
var xss = require('xss');
var passwordHash = require('password-hash');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.connected)
  	res.redirect('/');   
  res.render('subscribe');
});

router.post('/',(req,res,next) => {
	var name =  xss(req.body.name);
	var password = req.body.password;
	var user = new users({
		 name:name,
		 password:passwordHash.generate(password)
		});
	user.save(function (err) {
		  if (err) {
				return err;
		  }
		  else {
		  	console.log("User "+name+" saved");
			  }
		});	
	req.session.user = name;
	req.session.c = 0;	
	res.redirect('/');
	
});


module.exports = router;