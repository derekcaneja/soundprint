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
		this.$el.append(options.footer.el)
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
		_.bindAll(this, 'play')
		this.$el.attr('rel', this.model.get('title'));
		this.$el.append('<div class="square"></div><div class="tool-container"></div>');
		this.$('.tool-container').append('<h3 style="color: ' + this.model.get('color') + '">' + this.model.get('title') + '</h3><div class="btn-group instrument"><a class="btn dropdown-toggle" data-toggle="dropdown" href="#">Default<span class="caret"></span></a><ul class="dropdown-menu"><div class="dropdownarrow"></div></ul></div><div class="lockflip"><i class="icon-unlock"></i><i class="icon-undo"></i></div><div class="tools"><div class="tool-row" tool-row="1"></div></div>');
		
		this.dropdownOpen = "false";


		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '.5';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		this.$('.instrument').children('.btn').css({'border-color': this.rgbaColor})
		
		//this.$('.dropdown-menu').css({'background-color': this.model.get('color')})
		this.$('.dropdown-toggle').dropdown();
		if(this.model.get('title') == "Bass"){
		 	this.$('.dropdown-menu').append('<li><a class="instrument-item">Bass 1</a></li><li><a class="instrument-item">Bass 2</a></li><li><a class="instrument-item">Bass 3</a></li>')
		}
		if(this.model.get('title') == "Rhythm"){
		 	this.$('.dropdown-menu').append('<li><a class="instrument-item">Rhythm 1</a></li><li><a class="instrument-item">Rhythm 2</a></li><li><a class="instrument-item">Rhythm 3</a></li>')
		}
		if(this.model.get('title') == "Harmony"){
		 	this.$('.dropdown-menu').append('<li><a class="instrument-item">Harmony 1</a></li><li><a class="instrument-item">Harmony 2</a></li><li><a class="instrument-item">Harmony 3</a></li>')
		}
		if(this.model.get('title') == "Melody"){
		 	this.$('.dropdown-menu').append('<li><a class="instrument-item">Melody 1</a></li><li><a class="instrument-item">Melody 2</a></li><li><a class="instrument-item">Melody 3</a></li>')
		}
		var knob2 = new Knob();
		var knob3 = new Knob();
		var reverb = new KnobView({ model:new Knob({title: 'Reverb'}) });
		var delay = new KnobView({ model:new Knob({title: 'Delay'}) });
		var gain = new KnobView({ model:new Knob({title: 'Gain'}) });

		var balance = new SliderView({ model:new Slider({title: 'Balance',type: 'balance', value: 3})});
		var volume = new SliderView({ model:new Slider({title: 'Volume',type: 'volume', value: 5, color: this.model.get('color'), handlecolor: this.model.get('gridcolor')})});

		this.$('.tool-row').append(delay.el, reverb.el, gain.el);
		this.$('.tools').append('<div class="tool-row"></div>');
		this.$('.tool-row:nth-of-type(2)').append(balance.el, volume.el);
		// this.$('.tool-row').append(delay.el);
		// this.$('.tool-row').append(gain.el);

		this.$('.square').append('<table class="tablegrid" data-table-name="' + this.model.get('title') + '"></table>');

		for(var i = 0; i < 12; i++) {
			var row = $('<tr data-sqtype="' + this.model.get('title') + '"></tr>');

			for(var x = 0; x < 12; x++) {
				row.append('<td></td>');
			}

			this.$('.tablegrid').append(row);
		}


	},
	render: function() {

	},
	events: {
		'mouseover'		: 'mouseover',
		'mouseleave'	: 'mouseleave',
		'mouseover .dropdown-toggle': 'btnhover',
		'mouseout .dropdown-toggle': 'btnleave',
		'click .dropdown-toggle': 'btnclick',
		'mouseover .instrument-item': 'lihover',
		'mouseout .instrument-item': 'lileave',
	},
	play: function(interval) {
		this.$('tr').each(function(index){
			if(index == (interval - 1) % 12) $(this).children().css({ background: 'rgba(255, 255, 255, 0.25)' });
			else $(this).children().css({ background: 'none' });
		});
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
	},
	btnleave: function(){
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
	lihover: function(ev){
		this.rgbaColor = jQuery.Color(this.model.get('color'));
 		this.rgbaColor = this.rgbaColor.toRgbaString();
 		this.borderAlpha = '1';
 		this.rgbaColor = this.rgbaColor.substring(0, 3) + 'a' + this.rgbaColor.substring(3, this.rgbaColor.length - 1) + ',' + this.borderAlpha + ')';
		$(ev.target).css({'background-color': this.rgbaColor});
	},
	lileave: function(ev){
		$(ev.target).css({'background-color': 'transparent'});
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
var FooterView = Backbone.View.extend({
	tagName: 'footer',
	className: 'footer',
	initialize: function() {
		this.$el.append('<div class="footer-container"><div class="leftbox"><a href="#">Learn more about Handprint</a></div><div class="record-container">Record</div><div class="twitter-container">Twitter</div></div>');
		
	}
});