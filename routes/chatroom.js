var express = require('express');
var router = express.Router();
var users = require('../models/users');
var messages = require('../models/messages');
var xss = require('xss');



/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user == undefined)
  	res.redirect('/');
  else{
  	var allMessages = [];
  	var cursor = messages.find().populate('creator').cursor();
  	cursor.on('data',(message) => {
  		allMessages.push(message);
  	});
  	cursor.on('close',() => {
  		var toSendMessages =[];
  		for (var i = 1; i<6 ; i++){
        var message = allMessages[allMessages.length-i];
        if(message.creator.name === req.session.user)
          message.creator.name = "me";
  			toSendMessages.push(message);
      }
  		toSendMessages.reverse();
  		res.render('chatroom',{user : req.session.user , messages : toSendMessages});
  	})
  	
  }
});
router.post('/',(req, res, next) => {
  if (req.session.user == undefined)
  	res.redirect('/');
  else{
	var content = xss(req.body.content);
	var username = req.session.user ;
	users.findOne({name:username}).exec((err,user) => {
			var message = new messages({content:content , creator:user._id});
			message.save((err)=>{console.log(err);});
			var cursor = messages.find().populate('creator').cursor();
			cursor.on('data',(messag)=>{});
			res.send('ok');
	});
 }

});



module.exports = router;
