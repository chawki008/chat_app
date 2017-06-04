var express = require('express');
var router = express.Router();
var tokens = require('../models/tokens');
var crypto = require("crypto")



/* GET home page. */
router.use((req,res,next) =>{
	if (req.session.user != 'chawki')
  		res.redirect('/login');
  	else 
  		next();
})

var generate = function() {

  var _token = crypto.randomBytes(64).toString('hex');
  token = new tokens({content:_token , used:false});
  token.save(token,(err)=>{});
  return token;
};
router.generate = generate;

router.get('/',(req, res, next)=>{
	const host = req.headers.host;
	tokens.findOne({used:false},(err,data)=>{
		if (err){
			console.log(err);
			res.send(500);
		}
		else {
			var url ='';	
			if (data){
				url = "http://" + host + "/subscribe?token=" + data.content;
				data.used = true;
				tokens.update({content:data.content},{used:true},(err)=>{});
			}

			else{	
				const dataa = generate();
				url = "http://" + host + "/subscribe?token=" + dataa.content;
				dataa.used = true;
				dataa.save((err)=>{});	
			}
			router.mailer.send('email', {
					    to: 'nbrighad@gmail.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
					    subject: 'Subscription link', // REQUIRED. 
					    url : url  
					  }, function (err) {
					    if (err) {
					      // handle error 
					      console.log(err);
					      res.send('There was an error sending the email');
					      return;
					    }
					    res.send('Email Sent');
					  });
		}
	})	
});



module.exports = router;
