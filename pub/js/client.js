'use strict';

const socket = io();

const vm = {
  data() {
    return {
      page: 'status',
      pollResults: [],
      voteSubmission: [
        'Robin',
        'Audrey',
        'Katie',
        'Steve',
        'Irving',
        'Emma',
        'Owen',
        'Adam'
      ],
    };
  },
  methods: {
    addItemToList() {
      if (isNotBlank(this.candidateItem)) {
        this.todoList.push(this.candidateItem);
        this.candidateItem = '';
      }
    },
    move(aSourceIndex, aDestinationIndex) {
      const sourceValue = this.voteSubmission[aSourceIndex];
      this.voteSubmission[aSourceIndex] = this.voteSubmission[aDestinationIndex];
      this.voteSubmission[aDestinationIndex] = sourceValue;
    },
    updatePoll(newPoll){
      this.pollResults = newPoll;
    },
    isNotBlank(aString) {
      return aString.length != 0 && aString.trim();
    },
    submitBallot(){
      socket.emit('submitBallot', this.voteSubmission);
      this.page = 'status';
    },
  },
};

socket.on('updateResults', function(serverResults) {
  app.updatePoll(serverResults);
});

// eslint-disable-next-line no-unused-vars
const app = Vue.createApp(vm).mount('#main');
