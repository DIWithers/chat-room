//Require looks in the node_modules folder
var http = require("http"); //core
var fs = require("fs"); //core

//Server is what happens when someone loads up the page in a browser.
//Server is listening below for http traffic at port xxxx
var server = http.createServer(function(req, res) {
	console.log("Someone connected via HTTP");
	fs.readFile("index.html", "utf-8", function(error, data) {
		// console.log(error);
		// console.log(data);
		if(error) {
			res.writeHead(500, {'content-type': 'text/html'})
			res.end(error);
		}
		else {
			res.writeHead(200, {'content-type': 'text/html'})
			res.end(data);
		}
		
	});
});
//Incl the socket.io module
var socketIo = require("socket.io"); //not part of Core, had to install
var io = socketIo.listen(server);
var socketUsers = [];
var chatHistory = [];
var currentCanvas = [];
//Listen to the server which is listening on port xxxx

//We need to deal with a new socket connection.
io.sockets.on("connect", function(socket) {

		socketUsers.push({
		socketID: socket.id,
		name: 'Anonymous'
	});

	io.sockets.emit('users', socketUsers);

	console.log("Someone connected via a socket!");
	console.log(socketUsers);

	socket.on("name_to_server", function(name) {
		for (var i = 0; i < socketUsers.length; i++) {
			if (socketUsers[i].socketID === socket.id) {
					socketUsers[i].name = name;
					break;
				}
		}
		io.sockets.emit("users", socketUsers);
	});

	socket.on("message_to_server", function(data){

		console.log("Someone sent a message to the server...");
		io.sockets.emit("message_to_client", { //object
			message: data.message,
			name: data.name,
			date: data.date
		});
	});
	socket.on("drawing_to_server", function(drawingData) {
		if(drawingData.lastMousePosition !== null) {
			io.sockets.emit("drawing_to_client", drawingData);
		}
		
	});

	socket.on("disconnect", function() {
		console.log(socket.id + "-- user has disconnected");
		for (var i = 0; i < socketUsers.length; i++) {
			if (socketUsers[i].socketID === socket.id) {
				socketUsers.splice(i, 1);
				break;
			}
			
		}
		io.sockets.emit("users", socketUsers);
		
	});
});
console.log(socketUsers);
server.listen(8080); 
console.log("Listening on Port 8080...")



//npm init(inside your main program folder makes a 'package.json file')
//socket.io dependency added with npm install socket.io --save((node_modules))