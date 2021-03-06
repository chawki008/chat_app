var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var users = require('./models/users');
var index = require('./routes/index');
var session = require('express-session')({ 
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true, 
  cookie:{maxAge: null}
  });
var cookie_checker = require("./middleware/cookie-checker");
var parseurl = require('parseurl');
var subscribe = require('./routes/subscribe')
var login = require('./routes/login');
var logout = require('./routes/logout');
var chatroom = require('./routes/chatroom');
var sendAuthMail = require("./routes/sendAuthMail");
var config = require("./config");
var app = express();
var mailer = require('express-mailer');
var NodeRSA = require('node-rsa');
var fs = require('fs');





fs.readFile("privateKey", function(err,data) {
    if(err) {
        return console.log(err);
    }
  var key = new NodeRSA(data.toString());
  mailer.extend(app, {
    from: 'chawki.cheikh008@gmail.com',
    host: 'smtp.gmail.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
      user: 'chawki.cheikh008@gmail.com',
      pass: key.decrypt(config.mailPassword).toString()
    }
  });
  sendAuthMail.mailer = app.mailer;
    
}); 
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');





app.use(session);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.socket = require('./socket.js');
app.use(cookieParser());
app.use(cookie_checker);
app.logout = logout;
app.login = login;
app.socket.setSession(session);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/subscribe',subscribe);
app.use('/login',app.login);
app.use('/chatroom',chatroom);
app.use('/logout',app.logout);
app.use('/sendAuthMail',sendAuthMail);
// sendAuthMail.generate();



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
