var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var mongoose = require('mongoose');
var users = require('./models/users');
var index = require('./routes/index');
var session = require('express-session')({ 
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true, 
  cookie:{maxAge: null}
  });
var parseurl = require('parseurl');
var subscribe = require('./routes/subscribe')
var login = require('./routes/login');
var chatroom = require('./routes/chatroom');
var app = express();
var sharedsession = require("express-socket.io-session");
var port = process.env.PORT || 8000;  
var io = require('socket.io').listen(app.listen(port));

app.use(session);

app.use(cookieParser());
if (session.user != undefined)
      console.log(session.user);

io.use(sharedsession(session,{autoSave:true}));

io.on('connection', function (socket) {
   socket.on('check',(msg)=>{
     console.log(socket.handshake.session.c);
     if (socket.handshake.session.c == 0)    
      {socket.broadcast.emit("nouveau" , socket.handshake.session.user); 
      socket.handshake.session.c += 1;
    socket.handshake.session.save();}
  });
  socket.on('msg',function(msg){
    socket.broadcast.emit('msg',socket.handshake.session.user+" "+ msg);
    }); 
  socket.on("pseudo",function(pseudo){
    socket.broadcast.emit("nouveau",pseudo);
  }); 
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
//app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'sup duck' ,
//   resave: false,
//   saveUninitialized: true,
//   //cookie: { secure: true }
// }))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req,res,next){
//     req.io = io;
//     next();
// });

app.use('/', index);
app.use('/subscribe',subscribe);
app.use('/login',login);
app.use('/chatroom',chatroom);
app.get('/logout',(req,res,next)=>{
  req.session.destroy((err)=>{console.error(err);
    res.redirect('/');})
});

// var router = express.Router();



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
