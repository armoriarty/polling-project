'use strict';

const socket = io();

const vm = {
  data() {
    return {
      page: 'status',
      pollResults: [],
      ballot: [],
      candidate: ''
    };
  },
  methods: {
    addCandidateToBallot() {
      if (this.isNotBlank(this.candidate)) {
        this.ballot.unshift(this.candidate);
        this.candidate = '';
      }
    },
    move(aSourceIndex, aDestinationIndex) {
      const sourceValue = this.ballot[aSourceIndex];
      this.ballot[aSourceIndex] = this.ballot[aDestinationIndex];
      this.ballot[aDestinationIndex] = sourceValue;
    },
    updatePoll(newPoll){
      this.pollResults = newPoll;
      this.ballot = this.pollResults;
    },
    isNotBlank(aString) {
      return aString.length != 0 && aString.trim();
    },
    submitBallot(){
      socket.emit('submitBallot', this.ballot);
      this.page = 'status';
    },
  },
};

socket.on('updateResults', function(serverResults) {
  app.updatePoll(serverResults);
});

// eslint-disable-next-line no-unused-vars
const app = Vue.createApp(vm).mount('#main');
