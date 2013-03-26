var KANVASCONTROL = new KanvasControl();

const MOUSE_DOWN = "mc";
const ENTER_FRAME = "ef";
const MOUSE_ROLL = "mr";

function KanvasControl(){
	//stateControl
	this.trackingKeys = false;
	this.runningMAIN  = false;
	
	//Shared & Used Variables
	this.kanvases = new myArray();
	this.kc = null;       
	this.keyDown = null;
	this.preventedKeys = null;
	this.overrideInput = null;
	this.allowDefault = false;
	this.blankImage = new Image();
}
KanvasControl.prototype.MAIN = function(){
	//
	for(this.iii = 0; this.iii < this.kanvases.ar.length; this.iii+=1){
		if(!this.kanvases.ar[this.iii].paused){
			
			//Reset 
			this.kanvases.ar[this.iii].wheelDelta = 0;	
			//
			this.kanvases.ar[this.iii].findDepths();
			this.kanvases.ar[this.iii].reScale();
			this.kanvases.ar[this.iii].runRollListeners();
			
			//Rendering
			if(this.kanvases.ar[this.iii].animated){
				if(this.kanvases.ar[this.iii].measureFPS){
					this.kanvases.ar[this.iii].FPS = this.kanvases.ar[this.iii].frameCounter.trackFPS(this.kanvases.ar[this.iii].minFPS); // Run Fps Tests
				}
				this.kanvases.ar[this.iii].drawNow();
			}
			
			if(this.kanvases.ar[this.iii].forceRenderNow){
				this.kanvases.ar[this.iii].reScale(true);
				this.kanvases.ar[this.iii].drawNow();
				this.kanvases.ar[this.iii].forceRenderNow = false;
			}
		}
	}
}
KanvasControl.prototype.startKeyTracking = function(){
	if(this.trackingKeys)return;
	this.trackingKeys = true;
	this.kc = 0;       
	this.keyDown = [];
	this.preventedKeys = new myArray(8);
	for(ii = 0; ii < 250; ii+=1)this.keyDown[ii] = false; //Populate this.keyDown Array

	document.onkeydown = function(e){
		//if(KANVASCONTROL.overrideInput) return false;
		e=e?e:window.event;
		if(!(e.target.type=="text" || e.target.type=="password")){
			KANVASCONTROL.kc = e.keyCode;
			console.log("Key Press: "+ KANVASCONTROL.kc);
			if(KANVASCONTROL.preventedKeys.contains(KANVASCONTROL.kc))e.preventDefault();//prevent default-prevented keys
			//
			else if(KANVASCONTROL.keyDown[KANVASCONTROL.kc]==false){//prevent rapid fire?
				KANVASCONTROL.keyDown[KANVASCONTROL.kc] = true;
			}
			
			if(KANVASCONTROL.overrideInput){
				KANVASCONTROL.overrideInput.send(e.which, false);
			}
		}
	}
	document.onkeypress = function(e){
		console.log("hello!");
		e=e?e:window.event;
		if(KANVASCONTROL.overrideInput){
			KANVASCONTROL.overrideInput.send(e.which);
		}
	}
	document.onkeyup = function(e){
		e=e?e:window.event;
		KANVASCONTROL.kc = e.keyCode;
		if(KANVASCONTROL.overrideInput == null)KANVASCONTROL.keyDown[KANVASCONTROL.kc] = false;
	}
}
KanvasControl.prototype.stopKeyTracking = function(){ 
	this.kc = null;
	this.preventedKeys = null;
	for(ii = 0; ii < 250; ii+=1)this.keyDown[ii] = false; //Reset this.keyDown Array
	document.onkeydown = null;
	document.onkeyup = null;
}
//--------------------------------------------------------------------

//---------------------------SIMPLE CANVAS----------------------------

//---------------
//  Constructor  
//---------------
function Kanvas(options){
	//Connection
	this.c = KANVASCONTROL;

	//Editable Properties
	this.measureFPS = options.measureFPS;	// Will We Run FPS Tests?
	this.logs = options.logs;           	// Whether to console.log additional Information
	this.baseFPS = options.baseFPS;       	// Target Frames Per Second; 
	this.minFPS = options.minFPS;       	// This logs a Warning If FPS this.running slower than this;
	this.canvasID = options.canvasID;    	// ID of your canvas element in the DOM
	this.trackKeys = options.trackKeys;  	// Automatically begin tracking keys
	this.bgColor = options.bgColor;   		// Automatically begin tracking keys
	this.parentID = options.parentID;     	// Where to place your new Kanvas
	this.handleScale = options.handleScale;	// Whether or not to automatically scale
	this.name = options.name				// Specific name for logging
	this.animated = options.animated		// Whether to draw every frame.
	this.resizeTime = options.resizeTime	// Time limit before reScaling
	
	//Set Defaults
	if(this.parentID   == null) this.parentID = null;
	if(this.measureFPS == null) this.measureFPS = true;
	if(this.baseFPS    == null) this.baseFPS = 60;
	if(this.minFPS     == null) this.minFPS = this.baseFPS - 5;
	if(this.logs       == null) this.logs = true;
	if(this.trackKeys  == null) this.trackKeys = true;
	if(this.bgColor    == null) this.bgColor = "#FFFFFF";
	if(this.handleScale== null) this.handleScale = true;
	if(this.animated   == null) this.animated = true;
	if(this.resizeTime == null) this.resizeTime = 10;
	if(this.name	   == null)	this.name = "Kanvas"+(this.c.kanvases.ar.length);
	
	//Non-Defaulted Editable Properties
	this.beforeRender = function(){};     // Commands to occur before a render cycle. Draws to stage
	
	
	//Main Accessor Properties
	this.canvas;                  // The Main this.canvas
	this.context;                 // The 2D Drawing object
	this.stage;         		  // Main this.stage object
	this.running = false;         // Is The Application this.running
	this.globalDepth = 0;    	  // Tracks Depth when moving across objects
	this.thisID = this;           // Current Kanvas
	this.parentContainer = null   // Container to hold the canvas
	this.paused = false;          // Whether or not to halt all work
	this.isCanvas = true;
	
	//Scaling Variables
	this.domElement = null;
	this.prevWidth = null;
	this.prevHeight = null;
	this.switchTime = 0;
	this.onScale = null;
	this.transScale = 1;
	this.limitScale = false;
	this.baseWidth = 1000;
	this.baseHeight = 1000;
	this.scaleMode = "best"
	
	

	// Mouse Properties
	this.mouseX = 0;              //Global Mouse X Position
	this.mouseY = 0;              //Global Mouse Y Position
	this.mouseDown = false;		  //Whether mouse is down
	this.wheelDelta = 0;    	  //Current Mouse Wheel Value
	
	//FPS Capture Variables
	this.FPS = 0;                 //Tracks Current FPS 
	

	//PRIVATE VARIABLES:
	this.frameCounter = new FrameCounter(this); //Keeps track of the Frame Rate
	var ii = 0;
	var nn = 0;
	var jj = 0;
	var kk = 0;
	this.forceRenderNow = false;
	
	//Mouse Event Tracking
	this.clickedob   = null;
	this.ob          = null;
	this.found       = false;
	this.mouseChange = false;
	this.onPress = null;
	this.onRelease = null;
	
	//Event System
	this.enterFrameListener = new myArray();
	this.clickListener = new myArray();
	this.rollListener = new myArray();
	
	// Image Loading System
	this.imageLoadQueue = new myArray(); //Tracks Images to load
	this.newImage = null;                //Current image loaded
	this.images = new Object();          //Holds Images
	this.onImageLoad = null;             //Function called after completion
	this.loadingImages = false;          //Currently Loading Images?2
	
	this.c.kanvases.ar.push(this);
	
	this.log(0, ["Created"]); // Console Log
}


//------------
//  Mutators
//------------

	// PreventKey: Given A KeyCode (0-250), Automatically prevent keys from 
	// 			   performing default browser actions
Kanvas.prototype.preventKey = function(keyCode){
	this.c.preventedKeys.ar.push(keyCode);
}
	// HideCuror:  Hides the mouse cursor from appearing on the canvas 
Kanvas.prototype.hideCursor = function(){this.canvas.style.cursor = "none"};
	// showCursor:  Hides the mouse cursor from appearing on the canvas 
Kanvas.prototype.showCursor = function(){this.canvas.style.cursor = "default"}
	// StartKeyTracking: Sets Variables and Events in order to capture key 
	//                   input through Kanvas
Kanvas.prototype.startKeyTracking = function(){this.c.startKeyTracking()}
	// stopKeyTracking:  Sets Variables and Events in order to capture key 
	//                   input through Kanvas
Kanvas.prototype.stopKeyTracking = function(){this.c.stopKeyTracking()};
	// setOverride: Sets an Object for KeyOverride
Kanvas.prototype.setOverride = function(override){ 
	this.c.overrideInput = override;
}

//-------------
//  Accessors
//-------------

	// getKeyDown: Given A KeyCode (0-250), Performs a test on the button given
	//              to determine if it's being held down currently
Kanvas.prototype.keyDown = function(){
	return this.c.keyDown;
}
	// getImage: Given the name assigned to an image, returns that image for drawing
Kanvas.prototype.getImage = function(imageName){
	if(this.images[imageName] == null){
		this.log(2, ['Bad Request for Image: "'+ imageName+'"']);
		return this.c.blankImage;
	}else return this.images[imageName];
}



//--------------------
//  Public Functions
//--------------------
	//Log : Logs a message if permitted
Kanvas.prototype.log = function(s, a){
	if(!this.logs && s==0)return false;
	this.ar = a;
	if(s==0){
		console.log("["+(this.name)+"]:",
					(this.ar.length>0)?(this.ar[0]):(""),
					(this.ar.length>1)?(this.ar[1]):(""),
					(this.ar.length>2)?(this.ar[2]):(""),
					(this.ar.length>3)?(this.ar[3]):(""),
					(this.ar.length>4)?(this.ar[4]):(""))
	}
	if(s==1){
		console.warn("["+(this.name)+"]:",
					(this.ar.length>0)?(this.ar[0]):(""),
					(this.ar.length>1)?(this.ar[1]):(""),
					(this.ar.length>2)?(this.ar[2]):(""),
					(this.ar.length>3)?(this.ar[3]):(""),
					(this.ar.length>4)?(this.ar[4]):(""))
	}
	if(s==2){
		console.error(
					"["+(this.name)+" Error]:",
					(this.ar.length>0)?(this.ar[0]):(""),
					(this.ar.length>1)?(this.ar[1]):(""),
					(this.ar.length>2)?(this.ar[2]):(""),
					(this.ar.length>3)?(this.ar[3]):(""),
					(this.ar.length>4)?(this.ar[4]):(""))
	}
	return true;
}
	// Start: Starts the Kanvas
Kanvas.prototype.start = function( onEngineLoad ){
	if(this.running){  // Prevent Double start
		this.log(1, ["Tried to Start", this.name, ", but it was already running"]); 
		return false;
	} 
	
	if(this.parentID==null){
		this.canvas = document.getElementById(this.canvasID);  // Set up Canvas
	}else {
		this.parentContainer = document.getElementById(this.parentID);
		$(this.parentContainer).css("background",this.bgColor); 
		this.canvas = document.createElement("canvas");    
		$(this.parentContainer).append(this.canvas);		
		this.canvasID = null;
		this.canvas.width = $(this.parentContainer).width();
		this.canvas.height = $(this.parentContainer).height();
	}
	
	this.context = this.canvas.getContext("2d");           // Set up Context
	addToContext(this.context);
	
	this.canvas.kanvas = this;					  		   // Link Canvas
	this.running = true;								   // Start Running
	this.showCursor();									   // Show Cursor By Default 
	this.stage = new Stage(this.thisID);				   // Create Stage	
	if(!this.c.runningMAIN){
		setInterval(function(){KANVASCONTROL.MAIN()}, 1000/this.baseFPS);      // Start main loop 
		this.c.runningMAIN = true;
	}
	this.startMouseTrack();          					   // Start mouse tracking	 	
	if(this.trackKeys)this.startKeyTracking();   		   // Start Key Tracking
	if(onEngineLoad!=null)onEngineLoad.call();		       // Call Finish Function
	
	this.log(0, ["Started"]); // Console Log
	return true;
}
	// RequireImage: Takes the reference name and the URL you want to assign to an image
	//				 and queues it for the next LoadAllImages Flush
Kanvas.prototype.requireImage = function(imgName, imgURL){
	this.imageLoadQueue.ar.push({name:imgName, url:imgURL});
}
	// LoadAllImages: Begins the process of loadings Images One by One from the Queue. 
	//                Takes a function as an argument which will run after the download completes.
Kanvas.prototype.loadAllImages = function(onFinishFunction){
	if(!this.loadingImages){
		this.loadingImages = true;
		this.onImageLoad = onFinishFunction;
		if(this.imageLoadQueue.ar.length == 0){
			this.log(0, ["Tried to Load Images, But No Images Queued"]);
			this.onImageLoad();
			return;
		}else{
			this.log(0, ["Began loading",this.imageLoadQueue.ar.length,"images"]);
			this.loadNextImage();
		}
	}else this.log(1,["Called LoadAllImages While Already In the Image Load Cycle"]);
}
	// AddEventListener: Given an Object and an Event Type, applies that event to the object
Kanvas.prototype.addEventListener = function(thisobject, stringType, priority){
	if(stringType == ENTER_FRAME){
		if(this.enterFrameListener.contains(thisobject)){
			this.log(1, ["Tried adding ENTER_FRAME twice to", thisobject]);
			return;
		}
		if(priority == null)this.enterFrameListener.ar.push(thisobject);
		else this.enterFrameListener.insertAt(priority, thisobject);
	}
	if(stringType == MOUSE_DOWN){
		if(this.clickListener.contains(thisobject)){
			this.log(1, ["Tried adding MOUSE_DOWN twice to", thisobject]);
			return;
		}
		thisobject.clicked = false;
		this.clickListener.ar.push(thisobject);
	}
	
	if(stringType == MOUSE_ROLL){
		if(this.rollListener.contains(thisobject)){
			this.log(1, ["Tried adding MOUSE_ROLL twice to", thisobject]);
			return;
		}
		thisobject.rolled = false;		
		this.rollListener.ar.push(thisobject);
		
	}
}
	// removeEventListener: Removes a given Event type from a given object
Kanvas.prototype.removeEventListener = function(thisobject, stringType){
	if(stringType == ENTER_FRAME)this.enterFrameListener.remove(thisobject);
	if(stringType == MOUSE_DOWN){
		thisobject.clicked = false;
		this.clickListener.remove(thisobject);
	}
	if(stringType == MOUSE_ROLL){
		if(thisobject.rolled && thisobject.mouseLeave!=null)thisobject.mouseLeave();
		thisobject.rolled = false;
		this.rollListener.remove(thisobject);
	}
}
	// Resize based on variables
Kanvas.prototype.reScale = function(forceScale){
	if(this.handleScale){
		if(this.parentContainer==null)return false;
		else this.domElement = $(this.parentContainer);
		//
		if(forceScale!=true && this.prevWidth == this.domElement.width()  && this.prevHeight ==  this.domElement.height()){
			this.switchTime += 1;
		}else{
			this.prevWidth = this.domElement.width();
			this.prevHeight = this.domElement.height();
			if(forceScale)this.switchTime = this.resizeTime
			else this.switchTime =  0
			this.forceScale = false;
		}
		if( this.switchTime == this.resizeTime){
			console.log("switched to ", this.prevWidth, this.prevHeight);
			this.WW = this.canvas.width;
			this.HH = this.canvas.height;
			this.canvas.width = this.prevWidth;
			this.canvas.height = this.prevHeight;
			this.switchTime = this.resizeTime + 1;
			this.prevWidth  = this.domElement.width();
			this.prevHeight = this.domElement.height();
			if(this.onScale != null)this.onScale(this.WW - this.prevWidth, this.HH - this.prevHeight);
			
		}
		if(this.scaleMode=="best"){
			this.transScale = Math.min(this.canvas.width/this.baseWidth, this.canvas.height/this.baseHeight);
		}else if(this.scaleMode=="fit"){
			this.transScale = Math.max(this.canvas.width/this.baseWidth, this.canvas.height/this.baseHeight);
		}
	}
}

Kanvas.prototype.forceRender = function(){
	this.forceRenderNow = true;
}
Kanvas.prototype.drawNow = function(){
	this.runEnterFrameScripts();
	if(this.beforeRender!=null)this.beforeRender();
	this.stage.render();
	if(this.postRender!=null)this.postRender();
}

//---------------------
//  Private Functions
//---------------------

	
	// Starts all Events Relevant to tracking mouse actions
Kanvas.prototype.startMouseTrack = function(){
	//
	$(this.canvas).mousemove(this.mouseMoveHandler);
	//else this.canvas.addEventListener("mousemove", this.mouseMoveHandler, false);
	//
	this.canvas.addEventListener('mousedown', this.mouseDownHandle, false);
	this.canvas.addEventListener('mouseup',   this.mouseUpHandle, false);
	this.canvas.addEventListener('mousewheel',this.mouseScroll, false);
	
}
// Starts all Events Relevant to tracking mouse actions
Kanvas.prototype.reStartMouseTrack = function(){

	$(this.canvas).mousemove(this.mouseMoveHandler);
	try {
		this.canvas.removeEventListener('mousedown', this.mouseDownHandle, false);
		this.canvas.removeEventListener('mouseup',   this.mouseUpHandle, false);
		this.canvas.removeEventListener('mousewheel',this.mouseScroll, false);
	} catch (e){}
	
	this.canvas.addEventListener('mousedown', this.mouseDownHandle, false);
	this.canvas.addEventListener('mouseup',   this.mouseUpHandle, false);
	this.canvas.addEventListener('mousewheel',this.mouseScroll, false);
}
	// Handles Mouse Scroll Wheel
Kanvas.prototype.mouseScroll = function(event){
	this.kanvas.wheelDelta = (event.wheelDelta/10);
}
	// Handles Mouse Movement And Tracking
Kanvas.prototype.mouseMoveHandler = function(e){
	//
	if(e.offsetX) {
		this.mouseX = e.offsetX;
		this.mouseY = e.offsetY;
	}else if(e.layerX) {
		this.mouseX = e.layerX;
		this.mouseY = e.layerY;
	}else if(e.clientX){
		this.mouseX = e.clientX - this.offsetLeft;
		this.mouseY = e.clientY - this.offsetLeft;
	}//else this.log("Couldn't Determine Mouse Coordinates", e.offsetX, e.layerX, e.pageX, e.clientX);
	
	if(e.target.type!="text")e.preventDefault()
	
	this.kanvas.mouseMove(this.mouseX, this.mouseY);
}
Kanvas.prototype.mouseMove = function(mX, mY){
	this.mouseX = mX;
	this.mouseY = mY;
	this.mouseChange = true;
	this.ob = this.clickedob;
	if(this.ob!=null){
		if(this.mouseX < this.ob.globalX || this.mouseX>this.ob.globalX+this.ob.width || this.mouseY<this.ob.globalY || this.mouseY>this.ob.globalY+this.ob.height){
			this.ob.clicked = false;
		}
	}
}
	// Handles Mouse Clicking
Kanvas.prototype.mouseDownHandle = function(e){
	this.kanvas.click();
	if(e.target.type!="text")e.preventDefault()
}
	// Also Handles Mouse Clicking
Kanvas.prototype.click = function(){
	this.found = false;
	this.mouseDown = true;
	for(ii = this.clickListener.ar.length-1; this.found==false && ii>= 0; ii -= 1){
		this.ob = this.clickListener.ar[ii];
		if(this.mouseX >= this.ob.globalX() && this.mouseX<=this.ob.globalX()+this.ob.width && this.mouseY>=this.ob.globalY() && this.mouseY<=this.ob.globalY()+this.ob.height){//if we are the target
			if(this.ob.mouseDown!=null)this.ob.mouseDown();
			this.ob.clicked = true;
			this.clickedob = this.ob;
			this.found = true;
			if(this.c.overrideInput!=null && this.c.overrideInput != this.clickedob)this.c.overrideInput.deselect();
		}
	}	
	if(!this.found && this.c.overrideInput!=null)this.c.overrideInput.deselect();
	if(this.onPress!=null)this.onPress(this.found);
}
	// Handles Mouse Releasing
Kanvas.prototype.mouseUpHandle = function(e){this.kanvas.mouseUp()};
	// Also Handles Mouse Releasing
Kanvas.prototype.mouseUp = function(){
	//
	if(this.onRelease!=null)this.onRelease();
	//
	this.mouseDown = false;
	this.ob = this.clickedob;
	//
	if(this.ob!=null){
		if(this.mouseX >= this.ob.globalX() && this.mouseX<=this.ob.globalX()+this.ob.width && this.mouseY>=this.ob.globalY() && this.mouseY<=this.ob.globalY()+this.ob.height){
			if(this.ob.clicked&&this.ob.mouseUp!=null)this.ob.mouseUp();
			this.ob.clicked = false;
		}
	}
}
	// Loads the Next Image in the Queue
Kanvas.prototype.loadNextImage = function(){
	newImage = new Image();
	newImage.src = this.imageLoadQueue.ar[0].url;
	newImage.sc  = this;
	this.images[this.imageLoadQueue.ar[0].name] = newImage;
	newImage.addEventListener('load', this.imageLoadComplete, false);	
}
	// Runs after Each Image has Loaded
Kanvas.prototype.imageLoadComplete = function(){
	if(this.height == null){
		this.log(2, ["Failed to load Image: ", this.src]);
	}
	this.sc.imageLoadQueue.removeAt(0);
	if(this.sc.imageLoadQueue.ar.length > 0)this.sc.loadNextImage();
	else{
		this.sc.loadingImages = false;
		this.sc.log(0, ["Finished loading images"]);
		if(this.sc.onImageLoad)this.sc.onImageLoad();
		else this.sc.log(1, ["No Function on Image Load Completion"]);
	}
}
	// Runs the Enter Frame Scripts
Kanvas.prototype.runEnterFrameScripts = function(){
	this.ii;
	for(this.ii = 0; this.ii< this.enterFrameListener.ar.length; this.ii+=1){
		this.enterFrameListener.ar[this.ii].every();
	}
}
	// Runs Mouse Movement And Roll Listeners
Kanvas.prototype.runRollListeners = function(){
	if(this.mouseChange){
		this.mouseChange = false;
		this.found = -1;
		this.ob = null;
		for(ii = this.rollListener.ar.length-1; ii>= 0; ii -= 1){
			this.ob = this.rollListener.ar[ii];
			
			if(this.ob.parent!=null && this.mouseX >= this.ob.globalX() && this.mouseX<=this.ob.globalX()+this.ob.width && this.mouseY>=this.ob.globalY() && this.mouseY<=this.ob.globalY()+this.ob.height){//if we are the target
				if(this.ob.mouseEnter!= null && !this.ob.rolled)this.ob.mouseEnter();
				this.ob.rolled = true;
				this.found = ii;
				
				
			}
			if(this.found!=ii){
				if(this.ob.mouseLeave!= null && this.ob.rolled)this.ob.mouseLeave();
				this.ob.rolled = false;
			}
		}	
	}
}
	// Sorts out Depth Issues For Accurate Rolling
Kanvas.prototype.findDepths = function(){	
	if(this.needsDepth){
		this.sortDefine = function(a,b){return a.depth - b.depth}
		this.globalDepth = 0;              //Reset Global Depth
		this.stage.reDepth();              //Start From Stage object
		this.clickListener.ar.sort(this.sortDefine); //reorganize our click and roll listeners
		this.rollListener.ar.sort(this.sortDefine);  //reorganize our click and roll listeners
		this.needsDepth = false;
	}
}
	// prepare: Turn a regular Object into a GraphicsObject
Kanvas.prepare = function(func){ 
	func.prototype = new graphicsObject();  
	func.prototype.constructor = func;  
	return func.prototype;
}
	// Provides a Smooth Movement Ability
Kanvas.prototype.moveTo = function(val1, val2, spd, round){
	if(Math.abs(val2 - val1) < Math.abs(0.001*val2)) {
		return val2;
	}else if(round)return Math.round(val1 + (val2 - val1)/spd);
	return val1 + (val2 - val1)/spd
}
	// 



//------------------
//  GraphicsObject
//------------------

	//Graphics Object Constructor
function graphicsObject(){
	this.kanvas = null;                 //The Kanvas object this is attatched to
	this.clicked = false;                     //If Event added, tracks whether currently pressed down	
	this.rolled = false;                      //If Event added, tracks whether currently rolled over	
	this.x = null;                            //Local X position
	this.y = null;                            //Local Y position
	this.alpha = 1;							  //Local Alpha
	this.scale = 1;                           //Local Scale
	this.rotation = 0;                        //Local Rotation
	this.myPoint = new Point(this.x, this.y); //Used for .point return
	this.width = null;                        //object Width, must be set manually! 
	this.height = null;                       //object Height, must be set manually!
	this.depth = -1;                          //Relative depth for RollOver and MouseDown Methods
	this.ii = 0;                              //Index
	this.children = new myArray();            //Graphics Children of this object
	this.parent = null;                       //Graphics Parent of this object
	this.canvas = null;                       //Canvas from Kanvas
	this.context = null;					  //Context from Kanvas
	this.stage = null;						  //Stage from Kanvas
}
	
	
	// -- Public --
	// setCanvas: Sets a Canvas as this object's Canvas
graphicsObject.prototype.setCanvas = function(kk){
	if(!this.parent==null){
		console.log("This must be removed from its parent before moved\n", 
					 this,
					 this.parent);		
	}
	if(kk==null){
		this.kanvas = this.context = this.canvas = this.stage = null;
		return false;
	}
	this.kanvas = kk;
	this.canvas = this.kanvas.canvas;
	this.context = this.kanvas.context;
	this.stage = this.kanvas.stage;
	for(this.ii = 0; this.ii< this.children.length(); this.ii++){
		this.children.ar[this.ii].setCanvas(kk);
	}
}

	// addChild: Adds a Child Graphically to this one
graphicsObject.prototype.addChild = function(childToAdd){
	this.addChildAt(this.children.ar.length, childToAdd);
}
	// addChildAt: Adds a Child Graphically to this one at a Given Index
graphicsObject.prototype.addChildAt = function(index, childToAdd){
	this.children.insertAt(index, childToAdd);
	childToAdd.setCanvas(this.kanvas);
	childToAdd.parent = this;
	if(this.kanvas!=null)this.kanvas.needsDepth = true;
}
	// removeChild: Removes a Child Graphically from this one
graphicsObject.prototype.removeChild = function(child){
	var index = this.children.indexOf(child);
	this.children.ar[index].parent = null;
	this.children.ar[index].setCanvas(null);
	this.children.removeAt(index);
	if(this.kanvas!=null)this.kanvas.needsDepth = true;
}
	// getChildAt: Returns a child At a Given Index
graphicsObject.prototype.getChildAt = function(index){
	if(index> this.children.ar || index < 0){
		console.log("Couldn't getChildAt: Out of bounds");
		return null;
	}
	return this.children.ar[index];
}
	// point:  Returns a point for this object's coordinates
graphicsObject.prototype.point = function(){
	this.myPoint.x = this.x;
	this.myPoint.y = this.y;
	return this.myPoint;
}
	// BoxMe: Draws a box around this object (sometimes ....)
graphicsObject.prototype.boxMe = function(rot){
	this.context.save();
	this.context.lineWidth = 1;
	this.context.strokeStyle = "rgba(255,0,0,100)";
	this.context.translate(this.width/2, this.height/2);
	if(rot==null)rot = this.rotation
	this.context.rotate(rot);
	this.context.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
	this.context.restore();
}
	// GlobalX: Returns the globalX of an object (sometimes ....)
graphicsObject.prototype.globalX = function(){
	if(this.parent == null) return this.x;
	else return this.x + this.parent.globalX()
}
	// GlobalY: Returns the globalY of an object (sometimes ....)
graphicsObject.prototype.globalY = function(){
	if(this.parent == null) return this.y;
	else return this.y + this.parent.globalY()
}

	
	
	//-- Private --
	// Render: Renders the Graphics Object
graphicsObject.prototype.render = function(cc){
	if(cc==null)this.ctx = this.context;
	else this.ctx = cc;
	this.ctx.save();
	if(this.preDraw)this.preDraw();//render stuff before children
	
	this.ctx.translate(this.x, this.y)
	if(this.rotation!=0)this.ctx.rotate(this.rotation);
	this.ctx.globalAlpha = this.alpha;
	this.ctx.scale(this.scale, this.scale);
	
	if(this.drawAt == null && this.draw)this.draw();//render stuff before children
	
	for(this.ii = 0; this.ii < this.children.ar.length; this.ii+=1){
		if(this.drawAt == this.ii && this.draw)this.draw();//render stuff before children
		this.children.ar[this.ii].render(); //render children
	}
	if(this.drawAt >= this.children.ar.length && this.draw)this.draw();//render stuff before children
	
	if(this.postDraw)this.postDraw();//render stuff after children
	
	this.ctx.restore();
}
	// Draw: To be filled with users' drawing instructions
graphicsObject.prototype.draw = function(){if(this.kanvas.logs)console.log("No preRender defined on "+this)};	
	// ReDepth: Used when any child is added or destroyed to get Depth sorted out
graphicsObject.prototype.reDepth = function(){
	if(this.kanvas){
		this.iii = 0;
		this.depth = this.kanvas.globalDepth;
		this.kanvas.globalDepth += 1;
		for(this.iii = 0; this.iii< this.children.ar.length; this.iii+=1)this.children.ar[this.iii].reDepth();
	}
}
	// Event Defaults
graphicsObject.prototype.every = function(){};
graphicsObject.prototype.mouseEnter = function(){};
graphicsObject.prototype.mouseLeave = function(){};
graphicsObject.prototype.mouseUp = function(){};
graphicsObject.prototype.mouseDown = function(){};


// --------- Empty Object-----------------------------------
function EmptyObject(){
	graphicsObject.call(this);
}
Kanvas.prepare(EmptyObject).draw = function(){};
//----------------------------------------------------------


// ------------------------------ Stage Object--------------
function Stage(kk){
	graphicsObject.call(this);
	this.setCanvas(kk);
	//
	this.depth = 0;
	this.width = this.canvas.width; 
	this.height = this.canvas.height;
	//
}
Kanvas.prepare(Stage).draw = function(){
	globalAlpha = 1;
	this.width = this.canvas.width; 
	this.height = this.canvas.height;
	//
	this.context.fillStyle = this.kanvas.bgColor;
	this.context.fillRect(-this.x/this.scale,-this.y/this.scale,this.width/this.scale,this.height/this.scale);
	//
	if(this.kanvas.limitScale){
		this.x = this.width/2;
		this.y = this.height/2;
		this.scale = this.kanvas.moveTo(this.scale, this.kanvas.transScale, 20);
	}
}	
//----------------------------------------------------------


//-------------------------------- FrameCounter Object------
function FrameCounter(k){
	var lastFrameCount = 120;           
	var dateTemp = new Date();
	var frameLast = dateTemp.getTime();
	var lastTime = frameLast;
	var frameCtr = 0;
	var frameStep = 1;
	var timeDifference = 0;
	var currentDate = new Date();
	var FPS = 0;
	var kc = null
	if(k)kc = k;
	this.trackFPS = function(minFPS){ //Run Every Frame to test our FPS
		currentDate = new Date();
		this.currentTime = currentDate.getTime()
		timeDifference = this.currentTime - lastTime;
		frameStep = (timeDifference/1000)*this.baseFPS;
		lastTime = this.currentTime;
		frameCtr +=1;
		if(this.currentTime >= frameLast+1000){ //If a second into the future
			FPS = frameCtr;
			frameCtr = 0;
			frameLast = this.currentTime;
			if(minFPS!=null && (FPS < minFPS)){
				kc.log(1, ["FPS Bad: ", FPS]);
			}
		}
		return FPS;
	}
}
//----------------------------------------------------------


//----------------------------------------MyArray Object----
function myArray(){
	this.ar = new Array() ; //Main data structure, completely public
	this.ii = 0;
	for(this.ii = 0; this.ii < myArray.arguments.length; this.ii+=1)this.ar.push(myArray.arguments[this.ii]); //We need to double back to get full support?
}
myArray.prototype.length = function(){return this.ar.length};
myArray.prototype.push = function(toPush){return this.ar.push(toPush)};
myArray.prototype.indexOf = function(pointer){
	if(pointer == null)return false;
	for(this.ii = 0; this.ii < this.ar.length; this.ii+=1){
		if(this.ar[this.ii] == pointer)return this.ii;
	}
	return -1;
}
myArray.prototype.contains = function(pointer){
	if(pointer == null)return false;
	for(this.ii = 0; this.ii < this.ar.length; this.ii+=1){
		if(this.ar[this.ii] == pointer)return true;
	}
	return false;
}
myArray.prototype.remove = function(pointer){
	for(this.ii = this.indexOf(pointer); this.ii < this.ar.length-1; this.ii+=1){
		this.ar[this.ii] = this.ar[this.ii+1];
	}
	this.ar.pop();
}
myArray.prototype.removeAt = function(index){
	for(this.ii = index; this.ii < this.ar.length-1; this.ii+=1){
		this.ar[this.ii] = this.ar[this.ii+1];
	}
	this.ar.pop();
}
myArray.prototype.insertAt = function(index, toAdd){
	if(index<0 || index>this.ar.length)return null;
	this.ar.push(this.ar[this.ar.length-1]);
	for(this.ii = this.ar.length-2; this.ii  > index-1; this.ii-=1){
		this.ar[this.ii+1] = this.ar[this.ii];
	}
	this.ar[index] = toAdd;
}
//----------------------------------------------------------


//----------------------------Point Object------------------
function Point(x, y){
    this.x = x;
    this.y = y;
	this.isPoint = true;
	this.isShape = true;
};
Point.prototype.add = function(v){
    return new Point(this.x + v.x, this.y + v.y);
};
Point.prototype.subtract = function(v){
    return new Point(this.x - v.x, this.y - v.y);
};
Point.prototype.angleTo = function(v){
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    return  Math.atan2(dy, dx);
};
Point.prototype.distance = function(v){
    var x = this.x - v.x;
    var y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
};
Point.prototype.equals = function(toCompare){
    return this.x == toCompare.x && this.y == toCompare.y;
};
Point.prototype.length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
};
Point.prototype.offset = function(dx, dy){
    this.x += dx;
    this.y += dy;
};
Point.prototype.toString = function(){
    return "(x=" + this.x + ", y=" + this.y + ")";
};
Point.prototype.midPoint = function(p1, p2){
    this.x = (p1.x+p2.x)/2
	this.y = (p1.y+p2.y)/2
};
Point.prototype.intersects = function(shape){
	KANVASCONTROL.intersect(this, shape);
}
//----------------------------------------------------------


//---------------------------------------Vector Object------
function Vector(magnitude, dir, name){
    this.mag = magnitude;
    this.direction = dir;
	this.expired = false;
	this.degradeRate = 0;
	this.degrades = false;
	this.isShape = true;
	this.isVector = true;
};
Vector.prototype.x = function(){
	return Math.cos((this.direction/180)*Math.PI)*this.mag
}
Vector.prototype.y = function(){
	return Math.sin((this.direction/180)*Math.PI)*this.mag
}
Vector.prototype.add = function(vector2){
	this.totalX = this.x() + vector2.x();
	this.totalY = this.y() + vector2.y();
	this.mag = Math.sqrt( this.totalX*this.totalX+this.totalY*this.totalY)
	this.direction = (Math.atan2(this.totalY, this.totalX)/Math.PI) * 180
}
Vector.prototype.degrade = function(rate){
	this.degradeRate = rate
	this.degrades = true;
}
Vector.prototype.turn = function(rate){
	if(this.degrades){
		this.mag -= this.degradeRate;
		if(this.mag<=0)this.expired = true;
	}
}
Vector.prototype.intersects = function(shape){
	KANVASCONTROL.intersect(this, shape);
}

//------------------------------------------------------------------------------
function Rect(l, t, r, b){
	this.left = l;
	this.top = t;
	this.right = r;
	this.bottom = b;
	this.isShape = true;
	this.isRect = true;
}
Rect.prototype.height = function(){
	return bottom-top;
}
Rect.prototype.width = function(){
	return right - left;
}
Rect.prototype.intersects = function(shape){
	KANVASCONTROL.intersect(this, shape);
}
//-------------------------------------------------------------------------------



//------------------------------------------------------------------------------
function Circle(xx, yy, rad){
	this.x = xx;
	this.y = yy;
	this.radius = rad;
	this.isShape = true;
	this.isCircle = true;
}
Circle.prototype.intersects = function(shape){
	KANVASCONTROL.intersect(this, shape);
}
//-------------------------------------------------------------------------------

KanvasControl.prototype.intersect = function(s, ss){
	if(!s.isShape || !ss.isShape){
		this.log(2, "Tried to call intersection on non shapes");
		return false;
	}
	if(s.isVector||ss.isVector){
		this.log(2, "Vector Intersections not implemented yet");
		return false;
	}
	
	if(s.isPoint && ss.isPoint){
		this.log(2, "Tried to call intersection on 2 points");
		 return false;
	}
	if(s.isRect && ss.isRect){
		 return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
	}
	if(s.isCircle && ss.isCircle){
		return Math.sqrt( (ss.x - s.x) *  (ss.x - s.x),(ss.y - s.y) *  (ss.y - s.y)) < (ss.radius + s.radius);
	}
	
	var point = (s.isPoint)?s:((ss.isPoint)?ss:null);
	var rect = (s.isRect)?s:((ss.isRect)?ss:null);
	var circle = (s.isCircle)?s:((ss.isCircle)?ss:null);
	var vector = (s.isVector)?s:((ss.isVector)?ss:null);
	
	
	if(point && rect){
		 return !(rect.left > point.x || rect.right < point.x || rect.top > point.y || rect.bottom < point.y);
	}
	if(circle && rect){
		rect.halfWidth = rect.width()/2;
		rect.halfHeight = rect.height()/2;
		var cx = Math.abs(circle.x - rect.x - rect.halfWidth);
		var xDist = rect.halfWidth + circle.radius;
		if (cx > xDist)
			return false;
		var cy = Math.abs(circle.y - rect.y - rect.halfHeight);
		var yDist = rect.halfHeight + circle.radius;
		if (cy > yDist)
			return false;
		if (cx <= rect.halfWidth || cy <= rect.halfHeight)
			return true;
		var xCornerDist = cx - rect.halfWidth;
		var yCornerDist = cy - rect.halfHeight;
		var xCornerDistSq = xCornerDist * xCornerDist;
		var yCornerDistSq = yCornerDist * yCornerDist;
		var maxCornerDistSq = circle.radius * circle.radius;
		return xCornerDistSq + yCornerDistSq <= maxCornerDistSq;
	}
	if(point && circle){
		return Math.sqrt( (point.x - circle.x) *  (point.x - circle.x),(point.y - circle.y) *  (point.y - circle.y)) < (circle.radius);
	}
	this.log(2, "Failed intersection")
	return false;
}	
//
function addToContext(ctx){
	if (!ctx.constructor.prototype.fillRoundedRect) {
		// Extend the canvaseContext class with a fillRoundedRect method
		 ctx.constructor.prototype.fillRoundedRect = 
			function (xx,yy, ww,hh, rad, fill, stroke) {
				if (typeof(rad) == "undefined") rad = 5;
				this.beginPath();
				this.moveTo(xx+rad, yy);
				this.arcTo(xx+ww, yy,    xx+ww, yy+hh, rad);
				this.arcTo(xx+ww, yy+hh, xx,    yy+hh, rad);
				this.arcTo(xx,    yy+hh, xx,    yy,    rad);
				this.arcTo(xx,    yy,    xx+ww, yy,    rad);
				if (stroke) this.stroke();  // Default to no stroke
				if (fill || typeof(fill)=="undefined") this.fill();  // Default to fill
		}; // end of fillRoundedRect method
	} 
}
