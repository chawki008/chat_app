var express = require('express');
var router = express.Router();
var users = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user != undefined)
  	res.redirect('/chatroom');
  else{
  res.render('index');
	}
});



module.exports = router;
