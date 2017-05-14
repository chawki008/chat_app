var express = require('express');
var router = express.Router();
var users = require('../models/users');



/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.connected)
  	res.redirect('/');   
  res.render('subscribe');
});

router.post('/',(req,res,next) => {
	var name = req.body.name;
	var password = req.body.password;
	var user = new users({
		 name:name,
		 password:password
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
	res.redirect('/');
	
});


module.exports = router;