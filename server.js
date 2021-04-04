const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const socketio = require("socket.io");
const io = socketio(server);
app.use(express.static("pub"));

const pollResult = [
  'Audrey',
  'Claire',
  'Owen',
  'Katie',
  'Adam',
  'Steve',
  'Irving',
  'Emma'
];

io.on("connection", function(socket) {
	console.log("Somebody connected.");
  socket.emit('updateResults', pollResult);

	socket.on("disconnect", function() {
		console.log("Somebody disconnected.");
	});

	socket.on("saySomething", function(dataFromClient) {
		console.log(dataFromClient);
		var s = new Date();
		socket.emit("sayBack", "From server, time="+s+": " + dataFromClient);
	});
});

server.listen(8080, function() {
	console.log("Server with socket.io is ready.");
});