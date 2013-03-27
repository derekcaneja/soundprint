//-----------------------------------------//
//------------------Views------------------//
//-----------------------------------------//


// Application View
//-----------------------------------------//
var ApplicationView = Backbone.View.extend({
	tagName: 'div',
	className: 'application',
	initialize: function(options) {
		this.$el.append(options.header.el);
		this.$el.append('<div class="content-wrapper"><div class="square-wrapper"></div></div>');

		for(var i = 0; i < options.content.length; i++) this.$('.square-wrapper').append(options.content[i].el);

		this.count = 0;
	},
	play: function() {
		this.interval = setInterval(function(){
			toneMatrix1.play(application.count);
			toneMatrix2.play(application.count);
			toneMatrix3.play(application.count);
			toneMatrix4.play(application.count);
			application.count++;
		}, 150);
	},
	stop: function() {
		clearInterval(this.interval);
	}
});

// Header View
//-----------------------------------------//
var HeaderView = Backbone.View.extend({
	tagName: 'header',
	className: 'header',
	initialize: function() {
		this.$el.append('<div class="logo-container"></div>');
		this.$('.logo-container').append('<div class="handprint-logo"></div><span>|</span><h1>Soundprint</h1>');
	}
});

// Tone Matrix View
//-----------------------------------------//
var ToneMatrixView = Backbone.View.extend({
	tagName: 'div',
	className: 'square-container',
	initialize: function() {
	
		this.$el.attr('rel', this.model.get('title'));
		this.$el.append('<div class="square"></div><div class="tool-container"></div>');
		this.$('.tool-container').append('<h3 style="color: ' + this.model.get('color') + '">' + this.model.get('title') + '</h3><div class="btn-group instrument"><a class="btn dropdown-toggle" data-toggle="dropdown" href="#">Default<span class="caret"></span></a><ul class="dropdown-menu"><!-- dropdown menu links --></ul></div><div class="tools"><div class="tool-row" tool-row="1"></div></div>');
		
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '.5';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		this.$('.instrument').children('.btn').css({'border-color': this.rgbaColor})
		
		this.$('.dropdown-toggle').dropdown();
		// if(this.model.get('title') == "Bass"){
		// 	this.$('.tool-container').children('select').append('<option value="0">Default Bass</option>')
		// }
		var knob2 = new Knob();
		var knob3 = new Knob();
		var reverb = new KnobView({ model:new Knob({title: 'Reverb'}) });
		var delay = new KnobView({ model:new Knob({title: 'Delay'}) });
		var gain = new KnobView({ model:new Knob({title: 'Gain'}) });

		var balance = new SliderView({ model:new Slider({title: 'Balance',type: 'balance', value: 3})});
		var volume = new SliderView({ model:new Slider({title: 'Volume',type: 'volume', value: 5, color: this.model.get('color'), handlecolor: this.model.get('gridcolor')})});

		this.$('.tool-row').append(reverb.el, delay.el, gain.el);
		this.$('.tools').append('<div class="tool-row"></div>');
		this.$('.tool-row:nth-of-type(2)').append(balance.el, volume.el);
		// this.$('.tool-row').append(delay.el);
		// this.$('.tool-row').append(gain.el);
		
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas2 = document.createElement('canvas');
		this.context2 = this.canvas.getContext('2d');
		
		
		this.ww = this.model.get('width');
		this.hh = this.model.get('height');
		
		this.hzSpaces = 16;
		this.vtSpaces = 16;
		
		this.hzLength = this.ww / this.hzSpaces;
		this.vtLength = this.hh / this.vtSpaces;
		//
		this.$('.square').append(this.canvas);
		//
		this.minThreshold = 0.3
		//
		
		this.resize();
		this.render();
		console.log(this.ww, this.hh, this.hzLength, this.vtLength);
		//
		this.densityArray = [];
		//
		for(var i= 0; i < this.vtSpaces; i+=1){
			var temp = [];
			for(var n = 0; n < this.hzSpaces; n+=1){
				temp.push(0);
			}
			this.densityArray.push(temp);
		}

		//
		//setInterval( function(){this2.render();}, (1000/30));
	},
	render: function() {		
		if(this.altImage){
			this.context.globalAlpha = 1;
			this.context.putImageData(this.altImage,0,0);
		}
	},
	sendFrame: function(data){	
		if(this.altImage){
			this.context.putImageData(this.altImage,0,0);
		}
		for(var n = 0; n < data.length; i += 1){
			for(var n = 0; n < data[i].length; n += 1){
				if	(data[i][n]<0.3)	this.densityArray[i][n] = 0; 
				else if(data[i][n]<0.6)	this.densityArray[i][n] = 1; 
				else 					this.densityArray[i][n] = 2; 
				
				this.context.fillStyle = "#FFFFFF";
				this.context.globalAlpha = this.densityArray[i][n]/4;
				this.context.fillRect(i*this.hzLength,n*this.vtLength, this.hzLength, this.vtLength);
			}
		}
		
	},
	events: {
		'mouseover'		: 'mouseover',
		'mouseleave'	: 'mouseleave',
		'mouseover .dropdown-toggle': 'btnhover',
		'mouseout .dropdown-toggle': 'btnleave'
	},
	
	resize: function(){
		this.canvas.width = this.canvas2.width = this.ww;
		this.canvas.height = this.canvas2.height = this.hh;
		this.context2.lineWidth = 1;
		this.context2.fillStyle = this.model.get('color');
		this.context2.fillRect(0,0,this.ww,this.hh);
		this.context2.strokeStyle = this.model.get('gridcolor');
		for(var i = 1; i < this.ww - 2; i += this.hzLength){
			this.context2.beginPath();
			this.context2.moveTo(i,0);
			this.context2.lineTo(i,this.hh);
			this.context2.closePath();
			this.context2.stroke();
		}
		for(var n = 1; n < this.hh - 2; n += this.vtLength){
			this.context2.beginPath();
			this.context2.moveTo(0,n);
			this.context2.lineTo(this.ww,n);
			this.context2.closePath();
			this.context2.stroke();
		}
		
		this.altImage = this.context2.getImageData(0,0,this.canvas2.width, this.canvas2.height);
	},
	mouseover: function(){
		this.$el.addClass('square-container-hover');
		//$('.square-container:not(.square-container-hover)').transition({opacity: 0.4});
	},
	mouseleave: function(){
		this.$el.removeClass('square-container-hover');
		//$('.square-container').transition({opacity: 1});
	},
	btnhover: function(){
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '1';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		this.$('.dropdown-toggle').transition({'border-color': this.rgbaColor});
		this.$('.dropdown-toggle').transition({'outline': '1px solid ' + this.rgbaColor});
		this.$('.dropdown-toggle').css({'box-shadow': '0px 0px 0px 1px ' + this.rgbaColor});
		//console.log(this.rgbaColor);
	},
	btnleave: function(){
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '.5';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		if(!this.$('.instrument').hasClass('open')){
			//this.rgbaColor = '.5';
			this.$('.dropdown-toggle').transition({'border-color': this.rgbaColor});
			this.$('.dropdown-toggle').transition({'outline': '1px solid transparent'});
			this.$('.dropdown-toggle').css({'box-shadow': 'none'});
			//console.log(this.rgbaColor);
		}
	}
});


// Knob View
//-----------------------------------------//
var KnobView = Backbone.View.extend({
	tagName: 'div',
	className: 'knob-container',
	initialize: function() {
		this.knob_dragging = false;
		this.$el.append('<div class="knob" knob-value="0"></div><div class="tick"></div><h5>' + this.model.get('title') + '</h5>');
	},
	render: function(){

	},
	events:{
		'mouseover' : 'mouseover',
		'mouseleave': 'mouseleave'
	},
	mouseover: function(){
		document.onselectstart = function(){ return false; };
	},
	mouseleave: function(){
		if(!this.knob_dragging){
		   document.onselectstart = null;
		}
	}
});

// Slider View
//-----------------------------------------//
var SliderView = Backbone.View.extend({
	tagName: 'div',
	className: 'slider-container',
	initialize: function() {
		this.$el.attr('rel', this.model.get('type'))
		this.$el.append('<span class="balance-lr">L</span><div class="slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false"><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><a class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="left: 50%;"></a></div><span class="balance-lr">R</span><h5>' + this.model.get('title') + '</h5>');
		this.handleColor = this.model.get('handlecolor');
		//this.handleColor = jQuery.Color(this.handleColor).lightness('.45').saturation('.3');
		if(this.$el.attr('rel') == 'balance'){
			this.$('.slider').slider({
		        min: 1,
		        max: 5,
		        value: 3,
		        orientation: "horizontal",
	   	 	});
		}
		if(this.$el.attr('rel') == 'volume'){
			this.$('.slider').slider({
		        min: 0,
		        max: 10,
		        value: 5,
		        orientation: "horizontal",
		        range: 'min',
	   	 	});
	   	 	this.$('.ui-slider-range').css({'background-color': this.model.get('color')});
	   	 	this.$('.ui-slider-handle').css({'background-color': this.handleColor});
		}
	},
	render: function() {

	}
});