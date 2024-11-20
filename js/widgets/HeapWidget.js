
var Heap = function() {
  var self = this;
  var graphWidget = new GraphWidget();


  var coord = new Array();
  var A = new Array();
  var amountVertex = 0;

  dummyInitArrayOne();
  init();

  clearScreen();

  dummyInitArrayTwo();
  init();

  var stateList = [];

  this.getGraphWidget = function() { return graphWidget; }
  
  function parent(i) { return Math.floor(i/2); }
  
  function left(i) { return i*2; }
  
  function right(i) { return i*2+1; }

  function dummyInitArrayOne(){
    var i;

    for (i = 1; i <= 31; i++){
      A[i] = new ObjectPair(31 - i, amountVertex); // testing layout, to leave the edges there for now
      amountVertex++;
    }
  }

  function dummyInitArrayTwo(){
    var i;

    var initValue = [] // set a huge number A[0] to prevent minor bug

    A = [];

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex); // testing layout, to leave the edges there for now
	  amountVertex++;
    }
  }

  function init() {
    var i, j;

    // compute vertex coordinates  
    var vtx_count = 1; // 1-based indexing
    for (i = 0; i <= 4; i++) { // we limit our visualization to 4 levels only
      var entriesInThisLevel = 1 << i; // 2^i
      for (j = 0; j < entriesInThisLevel; j++) {
        coord[vtx_count] = new Array();
        coord[vtx_count][0] = (2 * j + 1) * 900 / (2 * entriesInThisLevel); // x Coordinate
        coord[vtx_count][1] = 50 + 40 * i; // y Coordinate
        vtx_count++;
      }
    }

    // add vertices first

    for (i = 1; i < A.length; i++)
      graphWidget.addVertex(coord[i][0], coord[i][1], A[i].getFirst(), A[i].getSecond(), true);

    var edgeId;

    for (i = 2; i < A.length; i++){
      edgeId = i;
      parentVertex = A[parent(i)].getSecond();
      childVertex = A[i].getSecond();

      graphWidget.addEdge(parentVertex, childVertex, edgeId, EDGE_TYPE_UDE, 1, true);
    }
  }

  function clearScreen() {
    var i;

    // remove edges first
    for (i = 2; i < A.length; i++){
      graphWidget.removeEdge(i);
    }

    // remove vertices after removing edges
    for (i = 1; i < A.length; i++){
      graphWidget.removeVertex(A[i].getSecond());
    }

    amountVertex = 0;
  }

  this.insert = function(vertexText, startAnimationDirectly) {
    if (A.length > 31) {
      $('#insert-err').html('Sorry, max limit of 31 has been reached');
      return false;
    }
    
	for(i = 0; i < A.length; i++){
      if(A[i].getFirst() == parseInt(vertexText)){
        $('#insert-err').html('Sorry, that value is already inside the heap, this visualization can only handle unique elements');
        return false;
      }
    }

    if (startAnimationDirectly == true) {
      stateList = [];
    }

    var i, key, currentState;
    if (A.length > 1) {
      currentState = createState(A);
      currentState["status"] = 'The current Max Heap';
	  if(!startAnimationDirectly) { //buildv1
		currentState["lineNo"] = 2;
	  } else {
		currentState["lineNo"] = 0;
	  }
    	stateList.push(currentState); // zero-th frame, the starting point
      }

    A[A.length] = new ObjectPair(parseInt(vertexText), amountVertex);
    amountVertex++;
    i = A.length-1;
    // graphWidget.addVertex(coord[i][0], coord[i][1], A[i], V[i], false); // do not immediately show the vertex

    currentState = createState(A);
    currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = 'Insert ' + vertexText + ' at the back of compact array A';
	if(!startAnimationDirectly) { //buildv1
		currentState["lineNo"] = 3;
	} else {
		currentState["lineNo"] = [1,2];
	}
    stateList.push(currentState); // first frame, highlight the newly inserted vertex

    while (i > 1 && A[parent(i)].getFirst() < A[i].getFirst()) {
      currentState = createState(A);
      currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["vl"][A[parent(i)].getSecond()]["state"] = VERTEX_TRAVERSED;
	  currentState["status"] = A[parent(i)].getFirst() + ' is smaller than ' + A[i].getFirst() + ', so swap them'
	  if(!startAnimationDirectly) { //buildv1
		currentState["lineNo"] = 3;
	  } else {
        currentState["lineNo"] = 3;
	  }
	  stateList.push(currentState); // before swap

      var temp = A[i];
      A[i] = A[parent(i)];
      A[parent(i)] = temp;
      currentState = createState(A);
      currentState["vl"][A[i].getSecond()]["state"] = VERTEX_TRAVERSED;
      currentState["vl"][A[parent(i)].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = A[i].getFirst() + ' and ' + A[parent(i)].getFirst() + ' have been swapped';
	  if(!startAnimationDirectly) { //buildv1
		currentState["lineNo"] = 3;
	  } else {
	    currentState["lineNo"] = 4;
	  }
      stateList.push(currentState); // record the successive vertex swap animation
      i = parent(i);
    }

    currentState = createState(A); // record the final state of the heap after insertion to stop the highlights
    currentState["status"] = 'Insertion of ' + vertexText + ' has been done successfully';
	if(!startAnimationDirectly) { //buildv1
		currentState["lineNo"] = 3;
	} else {
		currentState["lineNo"] = 0;
	}
    stateList.push(currentState);

    if (startAnimationDirectly)
      graphWidget.startAnimation(stateList);

    return true;
  }

  this.shiftDown = function(i, calledFrom) {
    while (i < A.length) {
      var maxV = A[i].getFirst(), max_id = i;
      if (left(i) < A.length && maxV < A[left(i)].getFirst()) {
        maxV = A[left(i)].getFirst();
        max_id = left(i);
      }
      if (right(i) < A.length && maxV < A[right(i)].getFirst()) {
        maxV = A[right(i)].getFirst();
        max_id = right(i);
      }

      if (max_id != i) {
        var currentState = createState(A);
        currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
        currentState["vl"][A[max_id].getSecond()]["state"] = VERTEX_TRAVERSED;
        currentState["status"] = A[i].getFirst() + ' and ' + A[max_id].getFirst()+' need to be swapped';
		if(calledFrom == 'extractmax') {
			 currentState["lineNo"] = [4,5];
		} else if(calledFrom == 'buildv2') {
			currentState["lineNo"] = [2,3];
		} else if(calledFrom == 'heapsort') {
			currentState["lineNo"] = 2;
		}
        stateList.push(currentState); // deal with affected edges first

        var temp = A[i];
        A[i] = A[max_id];
        A[max_id] = temp;
        currentState = createState(A);
        currentState["status"] = A[i].getFirst() + ' and ' + A[max_id].getFirst() + ' have been swapped';
		if(calledFrom == 'extractmax') {
			 currentState["lineNo"] = 6;
		} else if(calledFrom == 'buildv2') {
			currentState["lineNo"] = [2,3];
		} else if(calledFrom == 'heapsort') {
			currentState["lineNo"] = 2;
		}
        stateList.push(currentState);

        i = max_id;   
      }
      else
        break;
    }
  }

  this.extractMax = function(startAnimationDirectly) {
    if (A.length == 2) {
      $('#extractmax-err').html('Sorry, the Max Heap contains only one item. This is the maximum element. We cannot delete any more items.');
      return false;
    }

    if (startAnimationDirectly == true) {
      stateList = [];
    }

    var currentState = createState(A);
    currentState["vl"][A[1].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
    currentState["status"] = 'Root stores the max element';
	if(!startAnimationDirectly) { //heapsort
		currentState["lineNo"] = 2;
	} else {
		currentState["lineNo"] = 0;
	}
    stateList.push(currentState); // highlight the root (max element)

    currentState = createState(A);
    // currentState["vl"][A[1].getSecond()]["cy"] -= 40;
    // currentState["vl"][A[1].getSecond()]["state"] = OBJ_REMOVED;
    delete currentState["vl"][A[1].getSecond()];
    currentState["status"] = 'Take out the root';
	if(!startAnimationDirectly) { //heapsort
		currentState["lineNo"] = 2;
	} else {
		currentState["lineNo"] = 1;
	}
    stateList.push(currentState); // move the root (max element) a bit upwards (to simulate 'extract max')

    if (A.length > 2) {
      currentState = createState(A);
      // currentState["vl"][A[1].getSecond()]["state"] = OBJ_REMOVED;
      // currentState["vl"][A[A.length-1].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      delete currentState["vl"][A[1].getSecond()];
      currentState["status"] = 'Replace root with the last leaf';
	  if(!startAnimationDirectly) { //heapsort
	  	currentState["lineNo"] = 2;
	  } else {
	  	currentState["lineNo"] = [2,3];
	  }
      stateList.push(currentState); // delete bottom-most right-most leaf (later, also remove its associated edge)
    }

    if (A.length > 2) {
      A[1] = A[A.length-1];
      A.splice(A.length-1, 1);
      currentState = createState(A);
      currentState["vl"][A[1].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = 'The new root';
	  if(!startAnimationDirectly) { //heapsort
	  	currentState["lineNo"] = 2;
	  } else {
	  	currentState["lineNo"] = [2,3];
	  }
      stateList.push(currentState); // highlight the new root
    }
	
	if(!startAnimationDirectly) { //heapsort
		this.shiftDown(1, 'heapsort');
	} else {
    	this.shiftDown(1, 'extractmax');
	}

    currentState = createState(A);
	if(!startAnimationDirectly) { //heapsort
		currentState["status"] = 'ExtractMax() has been completed';
	  	currentState["lineNo"] = 1;
	  } else {
		currentState["status"] = 'ExtractMax() has been completed';
	  	currentState["lineNo"] = 0;
	  }
    stateList.push(currentState);

    if (startAnimationDirectly)
      graphWidget.startAnimation(stateList);

    return true;
  }

  this.heapSort = function() {
    if (A.length == 2) {
      $('#heapsort-err').html('Sorry, the Max Heap contains only one item. This is the maximum element. We cannot delete any more items.');
      return false;
    }

    res = []; // copy first
    for (var i = 1; i < A.length; i++)
      res[i-1] = A[i].getFirst();
    res.sort(function(a,b){return a-b});

    stateList = [];
    var len = A.length-1;
    for (var i = 0; i < len-1; i++) // except the last item (minor bug if not stopped here)
      this.extractMax(false);

    currentState = createState(A);
    currentState["status"] = 'The final sorted order is ' + res;
	currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    return true;
  }

  this.buildV1 = function(arr) {
    if (arr.length > 31) {
      $('#buildv1-err').html('Sorry, you cannot build a Max Heap with more than 31 elements in this visualization.');
      return false;
    }

    var i;


    clearScreen(); 

    var initValue = [999999, parseInt(arr[0])];

    A = []; // destroy old A, create new one
	stateList = [];
	
	var currentState = createState(A);
    currentState["status"] = 'Start from an empty heap';
	currentState["lineNo"] = 1;
    stateList.push(currentState);

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex);
      amountVertex++;
    }
    init();

    currentState = createState(A);
    currentState["status"] = 'Insert ' + arr[0] + '. It becomes the new root';
	currentState["lineNo"] = [2,3];
    stateList.push(currentState);

    for (i = 1; i < arr.length; i++) // insert one by one
      this.insert(parseInt(arr[i]), false);

    currentState = createState(A);
    currentState["status"] = 'The Max Heap has been successfully built from input array: ' + arr;
	currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    return true;
  }

  this.buildV2 = function(arr) {
    if (arr.length > 31) {
      $('#buildv2-err').html('Sorry, you cannot build a Max Heap with more than 31 elements in this visualization.');
      return false;
    }

    var i;


    clearScreen();

    var initValue = [999999];

    A = []; // destroy old A, create new one

    for (i = 0; i < arr.length; i++)
      initValue[i+1] = parseInt(arr[i]);

    for (i = 0; i < initValue.length; i++){
      A[i] = new ObjectPair(initValue[i], amountVertex);
      amountVertex++;
    }
    init();

    stateList = [];
    var currentState = createState(A);
    currentState["status"] = 'First, copy the entire content of the input array into a Complete Binary Tree structure';
	currentState["lineNo"] = 1;
    stateList.push(currentState);

    for (i = Math.floor(arr.length/2); i >= 1; i--) { // check heap property one by one
      currentState = createState(A);
      currentState["vl"][A[i].getSecond()]["state"] = VERTEX_HIGHLIGHTED;
      currentState["status"] = 'Calling ShiftDown(' + i + ') to fix Max Heap property of subtree rooted at ' + A[i].getFirst() + ', if necessary';
	  currentState["lineNo"] = [2,3];
      stateList.push(currentState);

      this.shiftDown(i, 'buildv2');
    }

    currentState = createState(A);
    currentState["status"] = 'The Max Heap has been successfully built from input array: ' + arr;
	currentState["lineNo"] = 0;
    stateList.push(currentState);

    graphWidget.startAnimation(stateList);
    return true;
  }

  function createState(internalHeapObject) {
    var state = {
      "vl":{},
      "el":{},
      "status":{}
    };

    for (var i = 1; i < internalHeapObject.length; i++) {
      var key = internalHeapObject[i].getSecond();
      state["vl"][key] = {};

      state["vl"][key]["cx"] = coord[i][0];
      state["vl"][key]["cy"] = coord[i][1];
      state["vl"][key]["text"] = internalHeapObject[i].getFirst();
      state["vl"][key]["state"] = VERTEX_DEFAULT;
    }

    for (var i = 2; i < internalHeapObject.length; i++){
      var edgeId = i;

      state["el"][edgeId] = {};

      state["el"][edgeId]["vertexA"] = internalHeapObject[parent(i)].getSecond();
      state["el"][edgeId]["vertexB"] = internalHeapObject[i].getSecond();
      state["el"][edgeId]["type"] = EDGE_TYPE_UDE;
      state["el"][edgeId]["weight"] = 1;
      state["el"][edgeId]["state"] = EDGE_DEFAULT;
      state["el"][edgeId]["animateHighlighted"] = false;
    }

    return state;
  }
}
