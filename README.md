#ChatterDraw
###(Chat or Draw, but I hope you do both!)

##The early renderings are pretty plain, but I learned alot about sockets.
![Screenshot](screenshot.png "ChatterDraw screenshot")

##Built with:
---
```
- HTML5
- CSS
- Javascript
- AngularJS
- NodeJS
- Socket.io
```
##Sample Code:
---
###When someone loads up the page in a browser...
```
//Server is what happens when someone loads up the page in a browser.
//Server is listening below for http traffic at port xxxx
var server = http.createServer(function(req, res) {
	console.log("Someone connected via HTTP");
	fs.readFile("index.html", "utf-8", function(error, data) {
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
```
###Sockets enable real-time, bi-directional communication between web clients and servers. The client-side library runs in the browser and node.js handles the server-side library.
```
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
```
###Did you know there was a simple way to give the user a robust palette of colors?
```
<input type="color" id="color-picker">
```
### Future Add-ons:
* Make it competitive with scores
* Timed rounds
* Mulitple groups with a 'seating' limit
* It needs to be prettier
