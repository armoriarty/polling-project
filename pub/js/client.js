'use strict';

const socket = io();

const vm = {
  data() {
    return {
      page: 'status',
      pollResults: [],
      ballot: [],
      candidate: '',
      draggingEle: null,
      x: 0,
      y: 0,
      placeholder: null,
      //isDraggingStarted: null,
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
    mouseDownHandler(anEvent) {
      this.draggingEle = anEvent.target;
  
      // Calculate the mouse position
      const rect = this.draggingEle.getBoundingClientRect();
      this.x = anEvent.pageX - rect.left;
      this.y = anEvent.pageY - rect.top;
  
      // Attach the listeners to `document`
      document.addEventListener('mousemove', this.mouseMoveHandler);
      document.addEventListener('mouseup', this.mouseUpHandler);
    },
    swap(nodeA, nodeB) {
      const parentA = nodeA.parentNode;
      const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
  
      // Move `nodeA` to before the `nodeB`
      nodeB.parentNode.insertBefore(nodeA, nodeB);
  
      // Move `nodeB` to before the sibling of `nodeA`
      parentA.insertBefore(nodeB, siblingA);
    },
    setUpPlaceholder(aPlaceholdee){
        // Let the placeholder take the height of dragging element
        // So the next element won't move up
        this.placeholder = document.createElement('div');
        this.placeholder.classList.add('placeholder');
        this.draggingEle.parentNode.insertBefore(
            this.placeholder,
            this.draggingEle.nextSibling
        );
        // Set the placeholder's height
        this.placeholder.style.height = `${aPlaceholdee.height}px`;
    },
    createMovableRectangle(anEvent){
        const draggingRect = this.draggingEle.getBoundingClientRect();
        // Set position for dragging element
        this.draggingEle.style.position = 'absolute';
        this.draggingEle.style.top = `${anEvent.pageY - this.y}px`; 
        this.draggingEle.style.left = `${anEvent.pageX - this.x}px`;
        return draggingRect
    },
    mouseMoveHandler(anEvent) {
        const movingElement = this.createMovableRectangle(anEvent);

        if (!this.placeholder) {
            //this.isDraggingStarted = true;
            this.setUpPlaceholder(movingElement)
        }

        const elementAbove = this.draggingEle.previousElementSibling;
        const elementBelow = this.placeholder.nextElementSibling;

        if (this.isAbove(this.draggingEle, elementAbove)){
            // The current order    -> The new order
            // prevEle              -> placeholder
            // draggingEle          -> draggingEle
            // placeholder          -> prevEle
            this.swap(this.placeholder, this.draggingEle);
            this.swap(this.placeholder, elementAbove);
        } else if (this.isAbove(elementBelow, this.draggingEle)){
            // The current order    -> The new order
            // draggingEle          -> nextEle
            // placeholder          -> placeholder
            // nextEle              -> draggingEle
            this.swap(elementBelow, this.placeholder);
            this.swap(elementBelow, this.draggingEle);
        }
    },
    removePlaceholder(){
        if (this.placeholder){
            this.placeholder.parentNode.removeChild(this.placeholder);
        }
        this.placeholder = null;
    },
    mouseUpHandler() {
        this.removePlaceholder();

        // Remove the position styles
        this.draggingEle.style.removeProperty('top');
        this.draggingEle.style.removeProperty('left');
        this.draggingEle.style.removeProperty('position');

        this.x = null;
        this.y = null;
        this.draggingEle = null;

        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', this.mouseMoveHandler);
        document.removeEventListener('mouseup', this.mouseUpHandler);

        this.updateList();
    },
    updateList(){
        const elements = document.getElementById('list').querySelectorAll('.draggable')[0].innerText;
    },
    isAbove(nodeA, nodeB) {
        if (nodeA != null && nodeB != null){
            // Get the bounding rectangle of nodes
            const rectA = nodeA.getBoundingClientRect();
            const rectB = nodeB.getBoundingClientRect();

            return (rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2);
        }
        return false;
    },
  },
};

socket.on('updateResults', function(serverResults) {
  app.updatePoll(serverResults);
});

const app = Vue.createApp(vm).mount('#main');
