'use strict';

const socket = io();

const vm = {
    data() {
        return {
        page: 'polling station',
        polls: null,
        newPoll: '',
        currentPoll: null,
        pollResults: [],
        candidates: [],
        ballot: [],
        newCandidate: '',
        };
    },
    methods: {
        addPoll(){
            if(this.isNotBlank(this.newPoll)){
                socket.emit('proposePoll', this.newPoll);
                this.newPoll = '';
            }
        },
        addCandidateToBallot() {
            if (this.isNotBlank(this.newCandidate)) {
                this.ballot.unshift(this.newCandidate);
                this.newCandidate = '';
            }
        },
        move(aSourceIndex, aDestinationIndex) {
            const sourceValue = this.ballot[aSourceIndex];
            this.ballot[aSourceIndex] = this.ballot[aDestinationIndex];
            this.ballot[aDestinationIndex] = sourceValue;
        },
        setPollList(aPollNameList){
            this.polls = aPollNameList
        },
        getPoll(aPollName){
            socket.emit('requestPoll', aPollName);
            this.page = 'status';
        },
        updatePoll(aPoll){
            this.currentPoll = aPoll.name;
            this.pollResults = aPoll.results;
            this.ballot = aPoll.results;
        },
        isNotBlank(aString) {
            return aString.length != 0 && aString.trim();
        },
        submitBallot(){
            socket.emit('submitBallot', this.currentPoll, this.ballot);
            this.page = 'status';
        },
    },
};

socket.on('listPolls', function(aListOfPollNames) {
    console.log('Received Poll List');
    app.setPollList(aListOfPollNames);
});

socket.on('providePoll', function(aPoll) {
    console.log("received Poll:");
    console.log(aPoll);
    app.updatePoll(aPoll);
});

const app = Vue.createApp(vm).mount('#main');
