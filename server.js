const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const socketio = require("socket.io");
const io = socketio(server);
app.use(express.static("pub"));

let pollResult = [
  'Audrey',
  'Claire',
  'Owen',
  'Katie',
  'Adam',
  'Steve',
  'Irving',
  'Emma'
];

function calculatePoll(aUserId, aBallot) {
    pollResult = aBallot;
}

io.on("connection", function(socket) {
    console.log("Somebody connected.");
    socket.emit('updateResults', pollResult);

    socket.on("disconnect", function() {
        console.log("Somebody disconnected.");
    });

    socket.on("submitBallot", function(aBallot) {
        console.log(`User: ${socket.id} submitted Ballot:`)
        console.log(aBallot);
        calculatePoll(socket.id, aBallot);
        io.emit('updateResults', pollResult);
    });
});

server.listen(8080, function() {
    console.log("Server with socket.io is ready.");
});