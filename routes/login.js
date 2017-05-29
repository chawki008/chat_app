var express = require('express');
var router = express.Router();
var users = require('../models/users');
router.socket = null;
var xss = require('xss');
var passwordHash = require('password-hash');
/* GET home page. */



router.get('/', function(req, res, next) {
  if (req.session.user != undefined)
  	res.redirect('/');
  else {
  	res.render('login');
    }
  

});

router.post('/',(req,res,next) => {
if (req.session.user != undefined)
  	res.redirect('/');
else{
  var allUsers = [];
  var name = xss(req.body.name);
  var password = req.body.password;
  var cursor = users.find({name:name}).cursor();
  cursor.on('data',(doc) => {
  	allUsers.push(doc);
  });
  cursor.on('close',()=>{
  	if (allUsers.length == 0)
  	  res.send("0");
  	else if(passwordHash.verify(password ,allUsers[0].password )){
      if(router.socket.clients.indexOf(name)!== -1)
        res.send("2");
      else{
    		req.session.user = name;
        req.session.c = 0;
        res.cookie('loggedIn' , name,{ maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
    		res.send("1");
          }
	   }
  	else {
		// router.io.emit('auth_error','invalid credentials');
    res.send("0");
    // console.log(router.io);
  }
  
	});
	}
});


module.exports = router;
