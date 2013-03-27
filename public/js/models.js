//-----------------------------------------//
//-----------------Models------------------//
//-----------------------------------------//

var ToneMatrix =  Backbone.Model.extend({
	defaults: {
		title 		: 'New Tone Matrix',
		width		: 0,
		height		: 0,
		color 		: '#FFFFFF',
		gridcolor   : '#cccccc',
	}
});
var Knob = Backbone.Model.extend({
	defaults: {
		title		: 'Knob',
		value		: '0'
	}
});
var Slider = Backbone.Model.extend({
	defaults: {
		title		: 'Slider',
		value		: '0',
		type		: null,
		color		: '#1abc9c',
	}
});