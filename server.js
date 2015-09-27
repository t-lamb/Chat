// HTTP Portion
var http = require('http');
var fs = require('fs'); //use filesystem module
var url = require('url');

function requestHandler(req, res) {
	console.log("The URL is: " + req.url);

	var parsedUrl = url.parse(req.url);
	console.log("They asked for " + parsedUrl.pathname);

	var path = parsedUrl.pathname;
	if (path == "/") {
		path = "index.html";
		console.log("index!")
	}

	// read index.html
	fs.readFile(__dirname + '/' + path, 
		// callback function for reading

		function (err, fileContents) {
			// error handling
			console.log(__dirname + '/' + path);
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			res.writeHead(200);
			res.end(fileContents);	
		}
	);
	console.log("Got a request " + req.url);
}

var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

console.log("Server listening on port 8080");

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
			// send it to all the clients including self
			socket.emit('chatmessage', data);
			console.log("Received: 'chatmessage' " + data);
		});

		socket.on('disconnect', function(){
			console.log("Client has disconnected " + socket.id);
		});
	}
);