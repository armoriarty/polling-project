'use strict';
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

const submittedBallots = new Map();

function compareCandidate(a, b) {
    if (a[1] < b[1]) {
        return 1;
    }
    if (a[1] > b[1]) {
        return -1;
    }
    return 0;
}

function calculatePoll(aUserId, aBallot) {
    submittedBallots.set(aUserId, aBallot);
    const ballotCount = new Map();

    for(let [eachUser, eachBallot] of submittedBallots){
        for(let i = 0; i < eachBallot.length; i++){
            const eachCandidate = eachBallot[i];
            const voteWeight = (0.5)**(i);    // weight =  ar^(n) where a = 1 and i = n - 1
            if(ballotCount.has(eachCandidate)){
                const newCandidateTotal = voteWeight + ballotCount.get(eachCandidate);
                ballotCount.set(eachCandidate, newCandidateTotal);
            } else {
                ballotCount.set(eachCandidate, voteWeight);
            }
        }
    }
    console.log("Map of totals: ");
    console.log(ballotCount);

    const candidateTotals = Array.from(ballotCount.entries())
        .sort(compareCandidate)
        .map(eachCandidate => eachCandidate[0]);
    
    console.log("Final Ordering: ");
    console.log(candidateTotals);

    pollResult = candidateTotals;
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