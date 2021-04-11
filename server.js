'use strict';
const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const socketio = require("socket.io");
const io = socketio(server);
app.use(express.static("pub"));

class Poll {
    constructor(aName) {
      this.name = aName;
      this.pollResults = [];
      this.submittedBallots = new Map();
    }

    compareCandidate(a, b) {
        if (a[1] < b[1]) {
            return 1;
        }
        if (a[1] > b[1]) {
            return -1;
        }
        return 0;
    }

    calculatePoll(aUserId, aBallot) {
        this.submittedBallots.set(aUserId, aBallot);
        const ballotCount = new Map();
    
        for(let [eachUser, eachBallot] of this.submittedBallots){
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
            .sort(this.compareCandidate)
            .map(eachCandidate => eachCandidate[0]);
        
        console.log("Final Ordering: ");
        console.log(candidateTotals);
    
        this.pollResults = candidateTotals;
    }
}

const activePolls = new Map();

io.on("connection", function(socket) {
    console.log(`Voter ${socket.id} connected.`);
    socket.emit('listPolls', Array.from(activePolls.keys()));

    socket.on("disconnect", function() {
        console.log(`Voter ${socket.id} disconnected.`);
    });

    socket.on('proposePoll', function(aPollName) {
        if (!activePolls.has(aPollName)){
            activePolls.set(aPollName, new Poll(aPollName));
            io.emit('listPolls', Array.from(activePolls.keys()));
        }
    });

    socket.on('requestPoll', function(aPollName) {
        console.log('Saw Request for Poll: ' + aPollName);
        if(activePolls.has(aPollName)) {
            socket.emit('providePoll', {
                name: aPollName, 
                results: activePolls.get(aPollName).pollResults
            });
            socket.leaveAll();
            socket.join(aPollName);
        }
    });

    socket.on("submitBallot", function(aPollName, aBallot) {
        console.log(`User: ${socket.id} submitted Ballot:`)
        console.log(aBallot);
        if (activePolls.has(aPollName)){
            const poll = activePolls.get(aPollName);
            poll.calculatePoll(socket.id, aBallot);
            console.log(poll.pollResults);
            io.to(aPollName).emit('providePoll', {
                name: aPollName, 
                results: poll.pollResults
            });
        }
    });
});

server.listen(8080, function() {
    console.log("Server with socket.io is ready.");
});