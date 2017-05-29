


var cookie_checker = function(req,res,next)
{
	if (req.cookies.loggedIn && !req.session.user){
		req.session.user = req.cookies.loggedIn;
        req.session.c = 0;
		res.redirect("/");
	}
	else{
	next();
	}
}
module.exports = cookie_checker;