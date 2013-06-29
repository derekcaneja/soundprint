
//-----------------------------------------//
//------------------Views------------------//
//-----------------------------------------//


var rColors = [0.7,0.7,1.1,1.2];
var gColors = [0.7,1.2,1.1,0.7];
var bColors = [1.2,0.7,0.7,0.7];
var rColor = bColor = gColor = 0;
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
		//$('.square-border').height($('.square').outerHeight() + $('.tool-container').outerHeight());
		$('.square-border').width($('.square-border').parent('.square-container').width() + 8);
		//$('.square').css('margin-top', ($('.square-border').height() * -1));
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
		this.$el.append('<div class="content-wrapper"></div>');//<div class="square-wrapper"></div>
		for(var i = 0; i < options.content.length; i++) this.$('.content-wrapper').append(options.content[i].el);
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
		this.$el.append('<div class="square-border accelerate"></div><div class="wrapwrap"><div class="square"></div><div class="tool-container"><div class="tools-header"></div></div></div>');
		this.$('.tools-header').append('<h3 style="color: ' + this.model.get('color') + '">' + this.model.get('title') + '</h3>', new DropdownView({ model: this.model }).el, '<div class="lockflip"><i class="videoicon icon-facetime-video"></i><i class="lock icon-unlock icon-mirrored"></i><i class="flip icon-undo"></i></div></div>');
		this.$('.tools-header').after('<div class="tools"><div class="tool-row" tool-row="1"><canvas id="'+this.model.get('title')+'Waveform"></canvas></div>');

		this.index = this.model.get('index');
		//this.$('.square').css({
		//	'margin-top': '-742px'
		//});
		
		// this.rgbaColor = jQuery.Color(this.model.get('color'));
 	// 	this.rgbaColor = this.rgbaColor.toRgbaString();
 	// 	this.borderAlpha = '.5';
 	// 	this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		// this.$('.instrument').children('.btn').css({'border-color': this.rgbaColor});

		this.$('#'+this.model.get('title')+'Waveform').height('80px');
		this.$('#'+this.model.get('title')+'Waveform').width('100%');
		

		//console.log(this.$('.tool-row').height());

		var scope = this;

		this.pitch = new KnobView({ 
			model: new Knob({
				title: 'Pitch', 
				min: 1, 
				max: 6,
				onChange: function(aa){
					scope.ins.defOct = aa;
					scope.ins.rebuild();
					console.log(scope.ins.defOct);
				}
			})
		});

		this.distortion = new KnobView({ 
			model: new Knob({
				title: 'Notes',
				min: 0,
				max: 6,
				onChange: function(aa){
					scope.ins.poly = aa;
					scope.ins.rebuild();
					console.log(scope.ins.defOct);
				}
			})
		});
		this.reverb = new KnobView({ 
			model: new Knob({
				title: 'Length', 
				min: 1,
				onChange: function(aa){
					scope.ins.noteLength = aa * 1000;
					scope.ins.rebuild();
				}
			})
		});

		this.balance = new SliderView({ 
			model: new Slider({
				title: 'Balance',
				type: 'balance', 
				value: 3,
				onChange: function(aa){
					scope.ins.mul = aa / 10;
					scope.ins.rebuild();
				}
			})
		});

		this.volume = new SliderView({ 
			model: new Slider({
				title: 'Volume',
				type: 'volume', 
				value: 5, 
				color: this.model.get('color'), 
				handlecolor: this.model.get('gridcolor'),
				onChange: function(aa){
					scope.ins.mul = aa / 10;
					scope.ins.rebuild();
				}
			})
		});

		this.$('.tools').append('<div class="tool-row"></div>');
		this.$('.tool-row:nth-of-type(2)').append(this.pitch.el, this.distortion.el, this.reverb.el);
		this.$('.tools').append('<div class="tool-row"></div>');
		
		this.$('.tool-row:nth-of-type(3)').addClass('sliderrow').append(this.balance.el, this.volume.el);


		this.$el.addClass('accelerate');
		
		//TMVars
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.canvas2 = document.createElement('canvas');
		this.context2 = this.canvas2.getContext('2d');
		this.canvas3 = document.createElement('canvas');
		this.context3 = this.canvas3.getContext('2d');
		
		
		this.ww = this.model.get('width') + 7;
		this.hh = this.model.get('height') + 7;
		this.canvas.width = this.canvas2.width = this.canvas3.width = this.ww;
		this.canvas.height = this.canvas2.height = this.canvas3.height = this.hh;
		
		//
		this.$('.square').append(this.canvas);
		
		//
		this.minThreshold = 0.3
		
		this.locked = false;
		this.capVid = true;
		this.rot = 0;
		this.pic = null
		this.ins = null;
		
		this.notes = [];
		
		this.setNotes(1);
		this.render();
		

	},
	setNotes:function(nn){
		this.hzSpaces = 8;
		this.vtSpaces = 32/(nn||1);
		
		
		this.hzLength = this.ww / this.hzSpaces;
		this.vtLength = this.hh / this.vtSpaces;
		
		//
		/*this.canvas3.width = this.canvas3.width;
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
		}*/
	},
	setMat: function(m){
		if(this.locked)return false;
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
		for(var yyy = 0; yyy < m.length; yyy += 1){
			for(var xxx = 0; xxx < m[yyy].length; xxx += 1){
				this.densityArray
					[Math.floor((yyy/m.length)*this.vtSpaces)]
					[Math.floor((xxx/m[yyy].length)*this.hzSpaces)] += m[yyy][xxx];
			}
		}
	},
	setPic: function(p){
		if(this.locked)return false;
		this.pic = this.context.createImageData(Math.sqrt(p.length),Math.sqrt(p.length));
		for(var bb = 0; bb < p.length; bb += 1){
			//if(bb == p.length-1)console.log(p[bb]);
			this.pic.data[bb*4]    	 = Math.round(p[bb] * rColors[this.index]);
			this.pic.data[(bb*4) +1] = Math.round(p[bb] * gColors[this.index]);
			this.pic.data[(bb*4) +2] = Math.round(p[bb] * bColors[this.index]);
			this.pic.data[(bb*4) +3] = 255;
		}
		//console.log(p.length, this.pic.data.length)
	},
	render: function(beat){
		//
		this.context.globalAlpha = 1;
		this.context.fillStyle = this.model.get('color');
		this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
		if(this.pic){
			this.canvas2.width = this.pic.width;
			this.canvas2.height = this.pic.height;
			this.context2.putImageData(this.pic,0,0)
			this.context.globalAlpha = 0.3;
			this.context.drawImage(this.canvas2, 0,0,this.canvas.width, this.canvas.height);
			this.context.globalAlpha = 1;
			//,this.canvas.width, this.canvas.height);
		}else if(this.capVid){
			//this.context.drawImage(nocam,0,0,this.canvas.width,this.canvas.height);
			this.context.font = "14px verdana";
			this.context.fillStyle = "#000";
			this.context.fillText('No camera Feed :(', this.ww-140,this.hh - 10);
		}
		this.context.drawImage(this.canvas3, 0,0);
		
		//console.log(this.beat);
		var nextNotes = [];
		for( var nnn = 0; nnn < this.notes.length; nnn += 1){
			if(this.notes[nnn].a > 0){
				nextNotes.push(this.notes[nnn]);
				this.context.fillStyle = '#fff';
				this.context.globalAlpha = this.notes[nnn].a/2
				this.context.fillRect(	this.notes[nnn].x* this.canvas.width/this.hzSpaces,
										this.notes[nnn].y* this.canvas.height/this.vtSpaces,
										this.canvas.width/this.hzSpaces,
										this.canvas.height/this.vtSpaces);
				this.notes[nnn].a -= (this.locked)?(0.003):(0.03);
			}
		}
		this.notes = nextNotes;
	},
	events: {
		'mouseover'						: 'mouseover',
		'mouseleave'					: 'mouseleave',
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
		/*this.rot += 1;

		for(var i = 0; i < this.notes.ar.length; i+=1){
			notes[i].a = 0;
		}*/
	}

});

// Display Tone Matrix View
//-----------------------------------------//


// Knob View
//-----------------------------------------//
var KnobView = Backbone.View.extend({
	tagName: 'div',
	className: 'knob-container',
	initialize: function() {
		this.knob_dragging = false;

		this.knobValue = 0;
		this.knobValuePrev = 0;
		
		this.$el.append('<div class="knob accelerate" knob-value="0"></div><div class="tick accelerate"></div><h5>' + this.model.get('title') + '</h5>');
		
		this.min = this.model.attributes.min||0;
		this.max = this.model.attributes.max||10;
		this.setValue(this.model.attributes.value);
		
		this.render();
		this.$el.addClass('accelerate');
	},
	setValue: function(v){
		this.rot = Math.round(Math.min(Math.max(v, this.min), this.max));
		this.rotation = -125 + (25*this.rot);
		this.render();
	},
	render: function(){
		//this.knobValue = this.$('.knob').attr('knob-value');
		this.$('.knob').attr('knob-value', this.rot);
		

		this.model.set('value', this.rot);

		this.$('.tick').css({
			'transform'    		: 'rotate(' + this.rotation + 'deg)',
			'-ms-transform'    	: 'rotate(' + this.rotation + 'deg)',
			'-webkit-transform' : 'rotate(' + this.rotation + 'deg)',
			'-moz-transform'    : 'rotate(' + this.rotation + 'deg)',
			'-o-transform'    	: 'rotate(' + this.rotation + 'deg)'
		});
	},
	events:{
		'mouseover' : 'mouseover',
		'mouseleave': 'mouseleave',
		'mousedown'	: 'mousedown',
		'mouseup'	: 'mouseup'
	},
	mouseover: function(){
		//document.onselectstart = function(){ return false; };
	},
	mouseleave: function(){
		if(!this.knob_dragging) document.onselectstart = null;
	},
	mousedown: function() {
		var item = this;
		var offsetX = this.$('.knob').offset().left + this.$('.knob').width() / 2;
		var offsetY = this.$('.knob').offset().top + this.$('.knob').height() / 2;
		this.$el.css({'cursor': 'pointer'});
		this.$el.children().css({'cursor': 'pointer'});

		this.rotate = true;
		$('body').css({'cursor': 'pointer'});
		$(window).mousemove(function(e){
			if(item.rotate){
				item.rotation = Math.atan2(e.pageY - offsetY, e.pageX - offsetX) * 180 / Math.PI;

				item.rotation += 90;

				if(item.rotation > 120 && item.rotation < 150) item.rotation = 125;
				else if(item.rotation < -85 || item.rotation > 230) item.rotation = -100;
				else if(item.rotation < 230 && item.rotation > 130) item.rotation = -125;
				else if(item.rotation > 130) 						item.rotation = -125;

				item.setValue((item.rotation + 125) / 25 % 15)
	
				if(!item.pRot || item.rotation!=item.pRot){
					item.render();
					if(item.model.attributes.onChange){
						item.model.attributes.onChange.call(null, item.rot);
					}else console.log('noo way');
				}
				item.pRot = item.rotation;
			}
		});
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
		this.$el.addClass("slider" + this.model.get('type'));
		this.$el.append('<span class="balance-lr">L</span><div class="slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false"><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><a class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="left: 50%;"></a></div><span class="balance-lr">R</span><h5>' + this.model.get('title') + '</h5>');
		this.handleColor = this.model.get('handlecolor');

		if(this.$el.hasClass('sliderbalance')){
			this.$('.slider').slider({
		        min: 1,
		        max: 5,
		        value: 3,
		        orientation: "horizontal",
		        slide: function(events, ui) {
		        	item.model.set('value', ui.value);
		        	if(item.model.attributes.onChange){
						item.model.attributes.onChange.call(null, ui.value);
					} else console.log('noo way');
		        }
	   	 	});
		}
		if(this.$el.hasClass('slidervolume')){
			this.$('.slider').slider({
		        min: 0,
		        max: 10,
		        value: 5,
		        orientation: "horizontal",
		        range: 'min',
		        slide: function(events, ui) {
		        	item.model.set('value', ui.value);
		        	if(item.model.attributes.onChange){
						item.model.attributes.onChange.call(null, ui.value);
					} else console.log('noo way');
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
		this.$el.append('<a class="btn dropdown-toggle accelerate" data-toggle="dropdown" href="#">Default<span class="caret accelerate"></span></a><ul class="dropdown-menu accelerate"><div class="dropdownarrow"></div></ul>');
	
		for(var i = 0; i < 3; i++) this.$('.dropdown-menu').append('<li class="accelerate"><a class="instrument-item accelerate">' + this.model.get('title') + ' ' + (i + 1) + '</a></li>');
			this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '.4';
 		this.dropdownOpen = false;
 		this.rgbaColorDark = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + "1" + ')';
		this.rgbaColorLight = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		//this.$('.btn').css({'border-color': this.rgbaColorLight});
		this.$('.dropdown-toggle').dropdown();
		this.$('.dropdown-toggle').attr("rgbacolordark", this.rgbaColorDark);
		this.$('.dropdown-toggle').attr("rgbacolorlight", this.rgbaColorLight);
	},
	events: {
		'mouseenter .dropdown-toggle'	: 'dropdownhover',
		'mouseleave .dropdown-toggle'		: 'dropdownleave',
		'click .dropdown-toggle'		: 'btnclick',
		'mouseenter .instrument-item'	: 'listhover',
		'mouseleave .instrument-item'		: 'listleave'
	},
	dropdownhover: function(){

		// if(!this.$('.btn').hasClass('btnhover') && !this.$('.caret').hasClass('carethover')){
		// 	this.$('.btn').addClass('btnhover');
		// 	this.$('.caret').addClass('carethover');
		// 	//this.$('.dropdown-toggle').transition({'border-color': this.rgbaColorDark,'outline-color': this.rgbaColorDark}, 300);
		// }
		// this.dropdownButtonWidth = ((this.$('.btn').outerWidth()) * 0.5);
		// this.dropdownmenuMargin = (((this.$('.dropdown-menu').outerWidth() - this.$('.btn').outerWidth()) * -0.5) + 4);
		// this.$('.instrument-item').css({'color': jQuery.Color(this.model.get('color')).lightness('.2')});
		// this.$('.dropdown-menu').css({'border': '4px solid ' + this.model.get('color'), 'left': this.dropdownmenuMargin})
		// this.$('.dropdownarrow').css({'margin-left': ((this.$('.dropdown-menu').outerWidth() * 0.5) - 12), 'border-bottom-color': this.model.get('color')});
	},
	dropdownleave: function(){
		// this.$('.btn').removeClass('btnhover');
		// this.$('.caret').removeClass('carethover');
		// if(!this.$('.btn').hasClass('btnhover') && !this.$('.caret').hasClass('carethover')){
		// 	this.$('.dropdown-toggle').transition({'border-color': this.rgbaColorLight, 'outline-color': 'rgba(0,0,0,0)'}, 100);
		// }
			
	},
	btnclick: function(){
		this.dropdownOpen = true;
	},
	listhover: function(ev){
		$(ev.target).css({'background-color': this.rgbaColor});
	},
	listleave: function(ev){
		$(ev.target).css({'background-color': 'rgba(0,0,0,0)'});
	}
});
