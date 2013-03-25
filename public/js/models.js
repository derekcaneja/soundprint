//-----------------------------------------//
//-----------------Models------------------//
//-----------------------------------------//

var ToneMatrix =  Backbone.Model.extend({
	defaults: {
		title 		: 'New Tone Matrix',
		color 		: '#FFFFFF'
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
		type		: null
	}
});