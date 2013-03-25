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
		}, 125);
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
		this.$('.tool-container').append('<h3 style="color: ' + this.model.get('color') + '">' + this.model.get('title') + '</h3><div class="tools"><div class="tool-row" tool-row="1"></div></div>');
		//var knob = ;
		var knob2 = new Knob();
		var knob3 = new Knob();
		var reverb = new KnobView({ model:new Knob({title: 'Reverb'}) });
		var delay = new KnobView({ model:new Knob({title: 'Delay'}) });
		var gain = new KnobView({ model:new Knob({title: 'Gain'}) });

		var balance = new SliderView({ model:new Slider({type: 'balance'})});

		this.$('.tool-row').append(reverb.el, delay.el, gain.el);
		this.$('.tools').append('<div class="tool-row"></div>');
		this.$('.tool-row:nth-of-type(2)').append(balance.el);
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
		'mouseleave'	: 'mouseleave'
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
		this.$el.append('<div class="slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all" aria-disabled="false"><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><div class="ui-slider-segment"></div><a class="ui-slider-handle ui-state-default ui-corner-all" href="#" style="left: 50%;"></a></div>');
		if(this.$el.attr('rel') == 'balance'){
			this.$('.slider').slider({
		        min: 1,
		        max: 5,
		        value: 3,
		        orientation: "horizontal",
	   	 	});
		}
	},
	render: function() {

	}
});