
var socketiO =  {
	clients : [] ,
	setServer : function(listenningServer) {this.listenningServer = listenningServer;},
	setSession : function(session) {this.session = session},
	run : function(app,callback)  {
	this.io = require('socket.io').listen(this.listenningServer);
	var sharedsession = require("express-socket.io-session");
	this.io.use(sharedsession(this.session,{autoSave:true}));

	this.io.on('connection', function (socket) {
	  socket.on('check',(msg)=>{
	  socketiO.clients.push(socket.handshake.session.user);
	  		
	      if (socket.handshake.session.c == 0)  {
	          socket.broadcast.emit("nouveau" , socket.handshake.session.user); 
	          socket.handshake.session.c += 1;
	          socket.handshake.session.save();
	      }
	  });
	  
	  socket.on('msg',function(msg){
	      socket.broadcast.emit('msg',socket.handshake.session.user+" "+ msg);
	  }); 
	  
	  socket.on("pseudo",function(pseudo){
	      socket.broadcast.emit("nouveau",pseudo);
	  }); 

	});
	  
	 app.logout.socket = app.socket;
	 app.login.socket = app.socket;
	 if (callback && typeof(callback) === "function")
		callback();
	
	
	}

}	
module.exports = socketiO;