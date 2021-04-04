'use strict';

var socket = io();

var vm = {
  data() {
    return {
      pollResults: [],
      voteSubmission: ['Robin'],
    };
  },
  methods: {
    addItemToList() {
      if (isNotBlank(this.candidateItem)) {
        this.todoList.push(this.candidateItem);
        this.candidateItem = '';
        this.updateServer();
      }
    },
    move(aSourceIndex, aDestinationIndex) {
      const sourceValue = this.todoList[aSourceIndex];
      this.todoList[aSourceIndex] = this.todoList[aDestinationIndex];
      this.todoList[aDestinationIndex] = sourceValue;
      this.updateServer();
    },
    updatePoll(newPoll){
      this.pollResults = newPoll;
    },
    updateServer() {
      console.log('Implement Me!!!');
    },
    isNotBlank(aString) {
      return aString.length != 0 && aString.trim();
    },
  },
  computed: {
  },
  mounted() {
    // getPollResults();
  },
};

/**
 * Update local poll results with server poll results
 */
// function getPollResults() {
//   socket.on('getPollResults', function(serverPollResults) {
//     pollResults = serverPollResults;
//   });
// };

socket.on('updateResults', function(serverResults) {
  app.updatePoll(serverResults);
})

// eslint-disable-next-line no-unused-vars
const app = Vue.createApp(vm).mount('#main');
