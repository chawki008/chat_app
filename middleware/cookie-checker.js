

var i = 0; 
var cookie_checker = function(req,res,next)
{	

	if(!req.session.checked){
		i++;
	    console.log(i);
		if (req.cookies.loggedIn && !req.session.user){
			req.session.user = req.cookies.loggedIn;
	        req.session.c = 0;
			res.redirect("/");
		}
		else{
		next();
		}
	}
	else 
		next();
	req.session.checked = true;
}
module.exports = cookie_checker;