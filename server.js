// HTTP Portion
var http = require('http');
var fs = require('fs'); //use filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
	// read index.html
	fs.readFile(__dirname + '/index.html', 
		// callback function for reading
		function (err, data) {
			// error handling
			if (err) {
				res.writeHead(500);
				return res.end('Error loading canvas_socket.html');
			} else {
				res.writeHead(200);
				res.end(data);
			}
		}
	);
}

// WebSocket Portion
// WebSockets work with the HTTP httpServer
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// runs for each user that connects
io.sockets.on('connection',
	// We are given a web socket object in our function
	function (socket) {
		console.log("We have a new client: " + socket.id);

		// when this user emits, client side: socket.emit('otherevent', some data);
		socket.on('chatmessage', function(data){
			// data comes in when it is sent, including objects
			console.log("Received: 'chatmessage' " + data);
			// send it to all the clients
			socket.broadcast.emit('chatmessage', data);
			console.log("Received: 'chatmessage' " + data);
		});

		socket.on('disconnect', function(){
			console.log("Client has disconnected " + socket.id);
		});
	}
);