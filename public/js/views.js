
//-----------------------------------------//
//------------------Views------------------//
//-----------------------------------------//


// Application View
//-----------------------------------------//
var ApplicationView = Backbone.View.extend({
	tagName: 'div',
	className: 'application',
	initialize: function(options) {
		_.bindAll(this, 'resize');
		this.$el.append(options.header.el);
		this.$el.append('<div class="content-wrapper"><div class="square-wrapper"></div></div>');
		//this.$el.append(options.footer.el)
		for(var i = 0; i < options.content.length; i++) this.$('.square-wrapper').append(options.content[i].el);

		this.count = 0;
	},
	resize: function(){
		$('.square').height($('.square-container').width());
		$('.square-border').height($('.square').height()+$('.tool-container').height()+15);
		$('.square-border').width($('.square-border').parent('.square-container').width() + 8);
		$('.square').css('margin-top', ($('.square-border').height() * -1) - 12);
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
var DisplayView = Backbone.View.extend({
	tagName: 'div',
	className: 'display',
	initialize: function(options) {
		this.$el.append(options.header.el);
		this.$el.append('<div class="content-wrapper"><div class="square-wrapper"></div></div>');
		for(var i = 0; i < options.content.length; i++) this.$('.square-wrapper').append(options.content[i].el);
		// for(var i = 0; i < options.content.length; i++) this.$('.square-wrapper').append(options.content[i].el);

		// this.count = 0;
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
	
		this.$el.attr('rel', this.model.get('title'));
		this.$el.append('<div class="square-border"></div><div class="square"></div><div class="tool-container"></div>');
		this.$('.tool-container').append('<h3 style="color: ' + this.model.get('color') + '">' + this.model.get('title') + '</h3>', new DropdownView({ model: this.model }).el, '<div class="lockflip"><i class="lock icon-unlock icon-mirrored"></i><i class="flip icon-undo"></i></div><div class="tools"><div class="tool-row" tool-row="1"><canvas id="'+this.model.get('title')+'Waveform"></canvas></div></div>');
		
		//this.$('.square').css({
		//	'margin-top': '-742px'
		//});
		
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '.5';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		this.$('.instrument').children('.btn').css({'border-color': this.rgbaColor});

		this.$('#'+this.model.get('title')+'Waveform').height('80px');
		this.$('#'+this.model.get('title')+'Waveform').width('100%');
		
		//console.log(this.$('.tool-row').height());

		this.pitch = new KnobView({ model:new Knob({title: 'Pitch'}) });
		this.distortion = new KnobView({ model:new Knob({title: 'Distort'}) });
		this.reverb = new KnobView({ model:new Knob({title: 'Reverb'}) });

		this.balance = new SliderView({ model:new Slider({title: 'Balance',type: 'balance', value: 3})});
		this.volume = new SliderView({ model:new Slider({title: 'Volume',type: 'volume', value: 5, color: this.model.get('color'), handlecolor: this.model.get('gridcolor')})});
		this.$('.tools').append('<div class="tool-row"></div>');
		this.$('.tool-row:nth-of-type(2)').append(this.pitch.el, this.distortion.el, this.reverb.el);
		this.$('.tools').append('<div class="tool-row"></div>');
		
		this.$('.tool-row:nth-of-type(3)').append(this.balance.el, this.volume.el);


		this.locked = false;
		this.flip = null;

		this.$('.square-border').css({'border-color': this.model.get('gridcolor')});
		


		// this.$('.tool-row').append(delay.el);
		// this.$('.tool-row').append(gain.el);
		
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas2 = document.createElement('canvas');
		this.context2 = this.canvas2.getContext('2d');
		this.canvas3 = document.createElement('canvas');
		this.context3 = this.canvas3.getContext('2d');
		
		
		this.ww = this.model.get('width') + 7;
		this.hh = this.model.get('height') + 7;
		
		this.hzSpaces = 16;
		this.vtSpaces = 16;
		
		this.hzLength = this.ww / this.hzSpaces;
		this.vtLength = this.hh / this.vtSpaces;
		//
		this.$('.square').append(this.canvas);
		
		//
		this.minThreshold = 0.3
		//
		this.canvas.width = this.ww;
		this.canvas.height = this.hh;
		
		//
		this.hasDensity = false;
		this.densityArray = [];
		//
		for(var i= 0; i < this.vtSpaces; i+=1){
			var temp = [];
			for(var n = 0; n < this.hzSpaces; n+=1){
				temp.push(0);
			}
			this.densityArray.push(temp);
		}
		
		this.pic = new Image();
		
		this.barY = 0;
		
		this.canvas.width = this.canvas3.width = this.ww;
		this.canvas.height = this.canvas3.height = this.hh;
		
		this.notes = new myArray();
		
		this.rot = 0;
		
		this.sendData();
		this.drawGrid();
		this.render();
		

	},
	drawGrid:function(){

		//
		this.context3.fillStyle = this.model.get('color');
		this.context3.fillRect(0,0,this.canvas3.width, this.canvas3.height);
		this.context3.lineWidth = 1;
		this.context3.strokeStyle = this.model.get('gridcolor');
		for(var i = this.hzLength; i < this.ww - 2; i += this.hzLength){
			this.context3.beginPath();
			this.context3.moveTo(i,0);
			this.context3.lineTo(i,this.hh);
			this.context3.closePath();
			this.context3.stroke();
		}
		for(var n = this.vtLength; n < this.hh - 2; n += this.vtLength){
			this.context3.beginPath();
			this.context3.moveTo(0,n);
			this.context3.lineTo(this.ww,n);
			this.context3.closePath();
			this.context3.stroke();
		}
	},
	sendData: function(data){	
		if(data){
			if(!this.locked){
				this.hasDensity = true;
				for(var nn = 0; nn < data.density.length; nn += 1){
					for(var ii = 0; ii < data.density[nn].length; ii += 1){
						if(data.density[nn][ii]<0.3) this.densityArray[nn][ii] = 0; 
						else this.densityArray[nn][ii] = 1; 
					}
				}
				if(this.rot>=4)this.rot = 0;
				for(var i = 0; i < this.rot; i+=1)this.densityArray = rotateMatrix(this.densityArray);
			}
		}
	},
	render: function(){
		//
		this.context.drawImage(this.canvas3,0,0);
		this.context.lineWidth = 2;
		this.context.strokeStyle = "#FFFFFF";
		this.barY += this.barS;
		//
		if(this.hasDensity){
			this.context.beginPath();
			this.context.moveTo(0,this.barY);
			this.context.lineTo(this.ww,this.barY);
			this.context.closePath();
			this.context.stroke();
			//
		}
		//
		this.context.fillStyle = "#FFFFFF";
		for(var i = 0; i < this.notes.ar.length; i+=1){
			this.note = this.notes.ar[i];
			//
			this.context.globalAlpha = this.note.a;
			this.context.fillRect(	this.note.xx * this.hzLength,
									this.note.yy * this.vtLength,
									this.hzLength,
									this.vtLength);
				
			//
			this.note.a -= (this.locked)?0.002:0.01;
			if(this.note.a <= 0){
				this.notes.remove(this.note);
				i -= 1;
			}
		}	
		this.context.globalAlpha = 1;
	},
	setBar: function(yy, frames){
		var item = this;
		var canvas = document.getElementById(item.model.get('title') + 'Waveform');		
		var context = canvas.getContext('2d');
		
		this.playBeat = yy;
		
		if(this.hasDensity){
			for(var i = 0; i < this.densityArray[this.playBeat].length; i+=1){
				if(this.densityArray[this.playBeat][i]==1){
					this.notes.ar.push({
						yy:this.playBeat,
						xx:i,
						a:0.5,
					});

					context.clearRect(0, 0, canvas.width, canvas.height);

					//var instrument = this.model.get('instrument');

					// instrument.env = T('+', 
					// 	T('delay', { time: item.pitch.model.get('value') * 100, fb: 1 }),
					// 	T('reverb', { damp: item.pitch.model.get('value') / 10 }),
					// 	T('dist', { pre: 40 * item.pitch.model.get('value') / 10, post: -12 * item.pitch.model.get('value') / 10, cutoff: 400 + (40 * item.pitch.model.get('value') / 10) })
					// );

					// instrument.noteOn(item.model.get('matrix')[item.playBeat][i] + 60 + item.pitch.model.get('value'), item.volume.model.get('value') * 8).plot({ 
					// 	target		: canvas, 
					// 	foreground	: item.model.get('color'), 
					// 	background	: 'rgba(0,0,0,0)', 
					// 	lineWidth	: 3
					// });
				};
			}
		}
		this.barY = (yy/this.vtSpaces)*this.hh;
		this.barS = this.vtLength/frames
	},
	events: {
		'mouseover'						: 'mouseover',
		'mouseleave'					: 'mouseleave',
		'mouseover .dropdown-toggle'	: 'dropdownhover',
		'mouseout .dropdown-toggle'		: 'dropdownleave',
		'click .dropdown-toggle'		: 'btnclick',
		'mouseover .instrument-item'	: 'listhover',
		'mouseout .instrument-item'		: 'listleave',
		'click .lock'					: 'lockMatrix',
		'click .flip'					: 'flipMatrix'
	},
	mouseover: function(){
		
		this.$('.square-border').css({'border-color': this.model.get('gridcolor')});
		//$('.square-container:not(.square-container-hover)').transition({opacity: 0.4});
	},
	mouseleave: function(){
		this.$('.square-border').css({'border-color': 'rgba(0,0,0,0)'});
		
	},
	dropdownhover: function(){
		this.$('.btn').addClass('btnhover');

		this.$('.caret').addClass('carethover');
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '1';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		this.$('.dropdown-toggle').transition({'border-color': this.rgbaColor});

		this.$('.dropdown-toggle').transition({'outline': '1px solid ' + this.rgbaColor}, 300);
		this.$('.dropdown-toggle').css({'box-shadow': '0px 0px 0px 1px ' + this.rgbaColor}, 300);
			
		this.dropdownButtonWidth = ((this.$('.btn').outerWidth()) * 0.5);
		this.dropdownmenuMargin = (((this.$('.dropdown-menu').outerWidth() - this.$('.btn').outerWidth()) * -0.5) + 4);
		this.$('.instrument-item').css({'color': jQuery.Color(this.model.get('color')).lightness('.2')});
		this.$('.dropdown-menu').css({'border': '4px solid ' + this.model.get('color'), 'left': this.dropdownmenuMargin})
		this.$('.dropdownarrow').css({'margin-left': ((this.$('.dropdown-menu').outerWidth() * 0.5) - 12), 'border-bottom-color': this.model.get('color')});

		this.$('.dropdown-toggle').transition({'outline': '1px solid ' + this.rgbaColor});
		this.$('.dropdown-toggle').css({'box-shadow': '0px 0px 0px 1px ' + this.rgbaColor});
		//console.log(this.rgbaColor);

	},
	dropdownleave: function(){
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '.5';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		if(!this.$('.instrument').hasClass('open')){
			//this.rgbaColor = '.5';
			this.$('.btn').removeClass('btnhover');
			this.$('.caret').removeClass('carethover');
			this.$('.dropdown-toggle').transition({'border-color': this.rgbaColor}, 300);
			this.$('.dropdown-toggle').transition({'outline': '1px solid transparent'}, 300);
			this.$('.dropdown-toggle').css({'box-shadow': 'none'});

			//console.log(this.rgbaColor);
		}

	},
	btnclick: function(){
		this.dropdownOpen = "true";
	},
	listhover: function(ev){
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '1';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		$(ev.target).css({'background-color': this.rgbaColor});
	},
	listleave: function(ev){
		$(ev.target).css({'background-color': 'transparent'});

	},
	lockMatrix: function(){
		if(!this.locked){
			this.$('.lock').removeClass('icon-unlock');
			this.$('.lock').addClass('icon-lock');
			this.$('.lock').addClass('iconselected');
			this.locked = true;
		} else{
			this.$('.lock').removeClass('iconselected');
			this.$('.lock').removeClass('icon-lock');
			this.$('.lock').addClass('icon-unlock');
			this.locked = false;
		}
	},
	flipMatrix: function(ev){
		this.rot += 1;

		for(var i = 0; i < this.notes.ar.length; i+=1){
			notes[i].a = 0;
		}
	}

});

// Display Tone Matrix View
//-----------------------------------------//
var DisplayToneMatrixView = Backbone.View.extend({
	tagName: 'div',
	className: 'square-container',
	initialize: function() {
	
		this.$el.attr('rel', this.model.get('title'));
		this.$el.append('<div class="square"></div>');
		
		this.$('#'+this.model.get('title')+'Waveform').height('80px');
		this.$('#'+this.model.get('title')+'Waveform').width('100%');
		
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas2 = document.createElement('canvas');
		this.context2 = this.canvas.getContext('2d');
		
		this.ww = this.model.get('width') + 7;
		this.hh = this.model.get('height') + 7;
		
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
				
				this.context.fillStyle = "#FFFFFF";
				this.context.globalAlpha = this.data[i][n]/4;
				this.context.fillRect(i*this.hzLength,n*this.vtLength, this.hzLength, this.vtLength);
			}
		}
	},
	events: {
		'mouseover'						: 'mouseover',
		'mouseleave'					: 'mouseleave',
		'click .lock'					: 'lockMatrix',
		'click .flip'					: 'flipMatrix'
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
		this.$('.square-border').css({'visibility': 'visible','border-color': this.model.get('gridcolor')});
		//$('.square-container:not(.square-container-hover)').transition({opacity: 0.4});
	},
	mouseleave: function(){
		this.$('.square-border').css({'visibility': 'hidden','border-color': this.model.get('gridcolor')});
		//$('.square-container').transition({opacity: 1});
	},
	lockMatrix: function(){
		if(!this.locked){
			this.$('.lock').removeClass('icon-unlock');
			this.$('.lock').addClass('icon-lock');
			this.$('.lock').addClass('iconselected');
			this.locked = true;
		} else{
			this.$('.lock').removeClass('iconselected');
			this.$('.lock').removeClass('icon-lock');
			this.$('.lock').addClass('icon-unlock');
			this.locked = false;
		}
	},
	flipMatrix: function(ev){
		//console.log($(ev.target));
		// $(ev.target).parent().addClass('fliprotate', function(){
		// setTimeout(function() {
		// 	$(ev.target).parent().removeClass('fliprotate');
		// }, 200);
		// });
	}
});

// Knob View
//-----------------------------------------//
var KnobView = Backbone.View.extend({
	tagName: 'div',
	className: 'knob-container',
	initialize: function() {
		this.knob_dragging = false;

		this.knobValue = 0;
		this.knobValuePrev = 0;
		
		this.$el.append('<div class="knob" knob-value="0"></div><div class="tick"></div><h5>' + this.model.get('title') + '</h5>');
		
		if(this.model.get('title') == 'Pitch') this.rotation = 0;
		else this.rotation = -125;

		this.render();
	},
	render: function(){
		if(this.model.get('title') == 'Pitch') {
			this.knobValue = this.$('.knob').attr('knob-value') - 5;
			this.$('.knob').attr('knob-value', (this.rotation + 125) / 25 % 15 - 5);
		} else {
			this.knobValue = this.$('.knob').attr('knob-value');
			this.$('.knob').attr('knob-value', (this.rotation + 125) / 25 % 15);
		}

		this.model.set('value', this.knobValue);

		this.$('.tick').css({
			'transform'    		: 'rotate(' + this.rotation + 'deg)',
			'-ms-transform'    	: 'rotate(' + this.rotation + 'deg)',
			'-webkit-transform' : 'rotate(' + this.rotation + 'deg)',
			'-moz-transform'    : 'rotate(' + this.rotation + 'deg)',
			'-o-transform'    	: 'rotate(' + this.rotation + 'deg)'
		});
	},
	events:{
		// 'mouseover' : 'mouseover',
		// 'mouseleave': 'mouseleave',
		// 'mousedown'	: 'mousedown',
		// 'mouseup'	: 'mouseup'
	},
	mouseover: function(){
		document.onselectstart = function(){ return false; };
	},
	mouseleave: function(){
		if(!this.knob_dragging) document.onselectstart = null;
	},
	mousedown: function() {
		/*var item = this;
		var offsetX = this.$('.knob').offset().left + this.$('.knob').width() / 2;
		var offsetY = this.$('.knob').offset().top + this.$('.knob').height() / 2;
		this.$el.css({'cursor': 'pointer'});
		this.$el.children().css({'cursor': 'pointer'});

		this.rotate = true;
		$('body').css({'cursor': 'pointer'});

		if(item.rotate){
			item.rotation = Math.atan2(e.pageY - offsetY, e.pageX - offsetX) * 180 / Math.PI;

			item.rotation += 90;

			if(item.rotation > 120 && item.rotation < 150) item.rotation = 125;
			else if(item.rotation < -85 || item.rotation > 230) item.rotation = -100;
			else if(item.rotation < 230 && item.rotation > 130) item.rotation = -125;
			else if(item.rotation > 130) 						item.rotation = -125;

			item.rotation = Math.round(item.rotation / 25) * 25;

			item.render();
		}*/
	},
	mouseup: function(){
		$('body').css({'cursor': 'default'});
	}
});

// Slider View
//-----------------------------------------//
var SliderView = Backbone.View.extend({
	tagName: 'div',
	className: 'slider-container',
	initialize: function() {
		var item = this;
		this.$el.attr('rel', this.model.get('type'))
		this.$el.append('<span class="balance-lr">L</span><div class="slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false"><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><a class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="left: 50%;"></a></div><span class="balance-lr">R</span><h5>' + this.model.get('title') + '</h5>');
		this.handleColor = this.model.get('handlecolor');

		if(this.$el.attr('rel') == 'balance'){
			this.$('.slider').slider({
		        min: 1,
		        max: 5,
		        value: 3,
		        orientation: "horizontal",
		        slide: function(events, ui) {
		        	item.model.set('value', ui.value);
		        }
	   	 	});
		}
		if(this.$el.attr('rel') == 'volume'){
			this.$('.slider').slider({
		        min: 0,
		        max: 10,
		        value: 5,
		        orientation: "horizontal",
		        range: 'min',
		        slide: function(events, ui) {
		        	item.model.set('value', ui.value);
		        }
	   	 	});
	   	 	this.$('.ui-slider-range').css({'background-color': this.model.get('color')});
	   	 	this.$('.ui-slider-handle').css({'background-color': this.handleColor});
		}
	}
});

// Footer View
//-----------------------------------------//
var FooterView = Backbone.View.extend({
	tagName: 'footer',
	className: 'footer',
	initialize: function() {
		this.$el.append('<div class="footer-container"><div class="leftbox"><a href="http://www.gethandprint.com">Learn more about Handprint</a></div><div class="record-container"><button class="recordbutton"><div class="recordcircle"></div>Record</button></div><div class="twitter-container">Twitter</div></div>');
	},
	events: {
		'click .recordbutton' : 'record'
	},
	record: function() {

	}
});

// Dropdown View
//-----------------------------------------//
var DropdownView = Backbone.View.extend({
	tagName: 'div',
	className: 'btn-group instrument',
	initialize: function() {
		this.$el.append('<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">Default<span class="caret"></span></a><ul class="dropdown-menu"><div class="dropdownarrow"></div></ul>');
	
		for(var i = 0; i < 3; i++) this.$('.dropdown-menu').append('<li><a class="instrument-item">' + this.model.get('title') + ' ' + (i + 1) + '</a></li>');

		this.$('.dropdown-toggle').dropdown();
	},
	events: {
		'mouseover .dropdown-toggle'	: 'dropdownhover',
		'mouseout .dropdown-toggle'		: 'dropdownleave',
		'click .dropdown-toggle'		: 'btnclick',
		'mouseover .instrument-item'	: 'listhover',
		'mouseout .instrument-item'		: 'listleave'
	},
	dropdownhover: function(){
		this.$('.btn').addClass('btnhover');

		this.$('.caret').addClass('carethover');
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '1';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		this.$('.dropdown-toggle').transition({'border-color': this.rgbaColor});

		this.$('.dropdown-toggle').transition({'outline': '1px solid ' + this.rgbaColor}, 300);
		this.$('.dropdown-toggle').css({'box-shadow': '0px 0px 0px 1px ' + this.rgbaColor}, 300);
			
		this.dropdownButtonWidth = ((this.$('.btn').outerWidth()) * 0.5);
		this.dropdownmenuMargin = (((this.$('.dropdown-menu').outerWidth() - this.$('.btn').outerWidth()) * -0.5) + 4);
		this.$('.instrument-item').css({'color': jQuery.Color(this.model.get('color')).lightness('.2')});
		this.$('.dropdown-menu').css({'border': '4px solid ' + this.model.get('color'), 'left': this.dropdownmenuMargin})
		this.$('.dropdownarrow').css({'margin-left': ((this.$('.dropdown-menu').outerWidth() * 0.5) - 12), 'border-bottom-color': this.model.get('color')});

		this.$('.dropdown-toggle').transition({'outline': '1px solid ' + this.rgbaColor});
		this.$('.dropdown-toggle').css({'box-shadow': '0px 0px 0px 1px ' + this.rgbaColor});
	},
	dropdownleave: function(){
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '.5';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		if(!this.$('.instrument').hasClass('open')){
			//this.rgbaColor = '.5';
			this.$('.btn').removeClass('btnhover');
			this.$('.caret').removeClass('carethover');
			this.$('.dropdown-toggle').transition({'border-color': this.rgbaColor}, 300);
			this.$('.dropdown-toggle').transition({'outline': '1px solid transparent'}, 300);
			this.$('.dropdown-toggle').css({'box-shadow': 'none'});
		}
	},
	btnclick: function(){
		this.dropdownOpen = "true";
	},
	listhover: function(ev){
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '1';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		$(ev.target).css({'background-color': this.rgbaColor});
	},
	listleave: function(ev){
		$(ev.target).css({'background-color': 'transparent'});
	}
});
