var express = require('express');
var router = express.Router();
var users = require('../models/users');
var xss = require('xss');
var passwordHash = require('password-hash');
var url = require('url');
var tokens = require('../models/tokens');
var da = "";

router.use(function(req,res,next){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	if(query.token){
		const token = query.token;
		tokens.findOne({content:token},(err,data)=> {	
					if(err){
						console.log(err);
						res.redirect("/");	
						}
					else if(data) {
						da = data;
					next();
					}
					else
						res.send("invalid token");
				});
	}
	else 
		res.send(404);

})
/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.connected)
  	res.redirect('/');   
  res.render('subscribe' , {token:da.content});
});

router.post('/',(req,res,next) => {
	var password = req.body.pass;
	var name =  xss(req.body.nam);
	users.findOne({name:name},(err,data)=>{
			if(err){
				console.log(err);
				res.send(500);
				return
			}		
			else if(data){
				res.send("0");
				return 
			}
			tokens.remove(da,(err)=>{});
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
			res.send("1");
		});
	
});


module.exports = router;