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

		this.$el.append('<div class="square"></div><div class="tool-container"></div>');
		this.$('.tool-container').append('<h3 style="color: ' + this.model.get('color') + '">' + this.model.get('title') + '</h3><div class="tools"></div>');
		
		var knob = new KnobView();
		this.$('.tools').append(knob.el);

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

	},
	play: function(interval) {
		this.$('tr').each(function(index){
			if(index == (interval - 1) % 12) $(this).children().css({ background: 'rgba(255, 255, 255, 0.25)' });
			else $(this).children().css({ background: 'none' });
		});
	}
});


// Knob View
//-----------------------------------------//
var KnobView = Backbone.View.extend({
	tagName: 'div',
	className: 'knob',
	initialize: function() {

	}
});

// Slider View
//-----------------------------------------//
var SliderView = Backbone.View.extend({
	tagName: 'div',
	className: 'slider',
	initialize: function() {

	}
});