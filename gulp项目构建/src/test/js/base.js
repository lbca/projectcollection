var Base = function(opt) {
	this.options = {};
};

Base.prototype = {
	init: function() {
		var that = this;
		console.log("I am start...");
		that.load(); 
		that.eventCode();
	},
	load: function() {
		console.log("come on data...");
	},
	eventCode: function() {

	}
};
var base = new Base();
base.init();