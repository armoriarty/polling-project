'use strict';

const socket = io();

const vm = {
    data() {
        return {
        page: 'status',
        pollResults: [],
        ballot: [],
        candidate: '',
        // movingCandidate: '',
        // draggingEle: null,
        // x: 0,
        // y: 0,
        // isDragging: false,
        // placeholderIndex: null,
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
        // mouseDownHandler(anEvent, anIndex) {
        //     this.draggingEle = anEvent.target;
        //     this.placeholderIndex = anIndex;
        //     console.log("Setting up placeholderIndex: " + this.placeholderIndex);
        //     console.log("\t Text at Placeholder is: " + this.ballot[this.placeholderIndex]);
        
        //     // Calculate the mouse position
        //     const rect = this.draggingEle.getBoundingClientRect();
        //     this.x = anEvent.pageX - rect.left;
        //     this.y = anEvent.pageY - rect.top;
        
        //     // Attach the listeners to `document`
        //     document.addEventListener('mousemove', this.mouseMoveHandler);
        //     document.addEventListener('mouseup', this.mouseUpHandler);
        // },
        // swap(nodeA, nodeB) {
        //     const parentA = nodeA.parentNode;
        //     const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
        
        //     // Move `nodeA` to before the `nodeB`
        //     nodeB.parentNode.insertBefore(nodeA, nodeB);
        
        //     // Move `nodeB` to before the sibling of `nodeA`
        //     parentA.insertBefore(nodeB, siblingA);
        // },
        // setUpPlaceholder(aPlaceholdee, aPlaceholderIndex){
        //     // Modify the Ballot Array instead and insert a Placeholder Element

        //     // // Let the placeholder take the height of dragging element
        //     // // So the next element won't move up
            
        //     // this.placeholder = document.createElement('div');
        //     // this.placeholder.classList.add('placeholder');
        //     // this.draggingEle.parentNode.insertBefore(
        //     //     this.placeholder,
        //     //     this.draggingEle.nextSibling
        //     // );
        //     // // Set the placeholder's height
        //     // this.placeholder.style.height = `${aPlaceholdee.height}px`;
        // },
        // createMovableRectangle(anEvent){
        //     const draggingRect = this.draggingEle.getBoundingClientRect();
        //     // Set position for dragging element
        //     this.draggingEle.style.position = 'absolute';
        //     this.draggingEle.style.top = `${anEvent.pageY - this.y}px`; 
        //     this.draggingEle.style.left = `${anEvent.pageX - this.x}px`;
        //     return draggingRect
        // },
        // mouseMoveHandler(anEvent) {
        //     const movingElement = this.createMovableRectangle(anEvent);
        //     // console.log(anEvent);

        //     if (!this.isDragging) {
        //         this.isDragging = true;
        //         console.log("Creating placeholder element at: " + this.placeholderIndex);
        //         console.log("\tHas Text: " + this.ballot[this.placeholderIndex]);
        //         this.movingCandidate = this.ballot[this.placeholderIndex];
        //         this.ballot[this.placeholderIndex] = "";
        //         //this.setUpPlaceholder(movingElement , anIndex)
        //     }

        //     const elementAbove = document.getElementById('list').querySelectorAll('.draggable')[this.placeholderIndex - 1]; //this.draggingEle.previousElementSibling;
        //     const elementBelow = document.getElementById('list').querySelectorAll('.draggable')[this.placeholderIndex + 1]; //this.placeholder.nextElementSibling;

        //     // console.log(elementAbove);
        //     // console.log(elementBelow);

        //     if (this.isAbove(this.draggingEle, elementAbove)){
        //         // The current order    -> The new order
        //         // prevEle              -> placeholder
        //         // draggingEle          -> draggingEle
        //         // placeholder          -> prevEle
        //         this.move(this.placeholderIndex, this.placeholderIndex - 1);
        //         this.placeholderIndex--;
        //         // this.swap(this.placeholder, this.draggingEle);
        //         // this.swap(this.placeholder, elementAbove);
        //     } else if (this.isAbove(elementBelow, this.draggingEle)){
        //         // The current order    -> The new order
        //         // draggingEle          -> nextEle
        //         // placeholder          -> placeholder
        //         // nextEle              -> draggingEle
        //         this.move(this.placeholderIndex, this.placeholderIndex + 1);
        //         this.placeholderIndex++;
        //         // this.placeholderIndex++;
        //         // this.move(this.placeholderIndex + 1, this.placeholderIndex + 2);
        //         // this.swap(elementBelow, this.placeholder);
        //         // this.swap(elementBelow, this.draggingEle);
        //     }
        // },
        // removePlaceholder(){
        //     // if (this.placeholder){
        //     //     this.placeholder.parentNode.removeChild(this.placeholder);
        //     // }
        //     console.log(this.movingCandidate)
        //     console.log("Placing Moving Candidate back into the list: " + this.movingCandidate);
        //     this.ballot[this.placeholderIndex] = this.movingCandidate;
        //     this.placeholder = null;
        //     this.placeholderIndex = null;
        // },
        // mouseUpHandler() {
        //     this.removePlaceholder();
        //     this.isDragging = false;

        //     // Remove the position styles
        //     this.draggingEle.style.removeProperty('top');
        //     this.draggingEle.style.removeProperty('left');
        //     this.draggingEle.style.removeProperty('position');

        //     this.x = null;
        //     this.y = null;
        //     this.draggingEle = null;

        //     // Remove the handlers of `mousemove` and `mouseup`
        //     document.removeEventListener('mousemove', this.mouseMoveHandler);
        //     document.removeEventListener('mouseup', this.mouseUpHandler);
        // },
        // isAbove(nodeA, nodeB) {
        //     if (nodeA != null && nodeB != null){
        //         // Get the bounding rectangle of nodes
        //         const rectA = nodeA.getBoundingClientRect();
        //         const rectB = nodeB.getBoundingClientRect();

        //         return (rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2);
        //     }
        //     return false;
        // },
    },
};

socket.on('updateResults', function(serverResults) {
    app.updatePoll(serverResults);
});

const app = Vue.createApp(vm).mount('#main');
