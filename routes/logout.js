var express = require('express');
var router = express.Router();


router.socket = null;
router.get('/', function(req, res, next) {
	if(typeof req.session.user !== "undefined")
    	router.socket.io.emit("logout",req.session.user +" a deconnecté");
  	router.socket.clients.pop(req.session.user);
  	req.session.destroy((err)=>{res.redirect('/');
});

  });


module.exports = router;