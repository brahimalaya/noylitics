/** 
 * The stats module provides two simple classes -- Counter and Rater. 
 * Counter...well, it counts. 
 * Rater provides an average rating for a list of identifiers.
 */

var sys = require('sys');
var events = require('events');

var stats = exports;

/**
 * The Counter keeps a list of identifiers and the number of 
 * times the identifier has been referenced.
 * @constructor
 */
stats.Counter = function() {
    this.countables = {};	
};

stats.Counter.prototype = {
    
    /**
     * Is the counter currently tracking the identifier?
     * @returns true if tracking, false if not
     */
    identifierExists : function(identifier) {
  	return this.countables.hasOwnProperty(identifier);
    },

    /**
     * Increment the count of the identifier.
     */
    increment : function(identifier)
    {	
	var currentCount = 0;
   	if(this.identifierExists(identifier))
   	{
	    currentCount = this.countables[identifier];
   	}
	this.countables[identifier] = ++currentCount;
    },
    
    /**
     * Returns the count of the identifier.
     */
    value : function(identifier) 
    {
  	return this.countables[identifier];
    }
 	
};

/**
 * The Rater keeps a list of identifiers and the ratings assigned to 
 * it.
 * @constructor
 */
stats.Rater = function() {
    this.rateables = {};	
};

stats.Rater.prototype = {
    
    /**
     * Is the rater currently tracking the identifier?
     * @returns true if tracking, false if not
     */
    identifierExists : function(identifier) {
  	return this.rateables.hasOwnProperty(identifier);
    },

    /**
     * Adds a rating to the identifier.
     */
    addRating : function(identifier, rating)
    {	
   	if(!this.identifierExists(identifier))
   	{
	    this.rateables[identifier] = [];
   	}
	this.rateables[identifier].push(rating);
	sys.puts(this.rateables[identifier]);
    },
    
    /**
     * Returns the average rating of the identifier.
     */
    value : function(identifier) 
    {
	var sum = 0;
	var ratings = this.rateables[identifier];
	for(var i = 0; i < ratings.length; i++)
	{
	    sys.puts("rating: " + ratings[i]);
	    sum = sum + parseInt(ratings[i]);
	}
	sys.puts("sum: " + sum);
	sys.puts("length: " + ratings.length);
	return (sum/ratings.length);
    }

};

stats.Statistics = function() {
    this.counters = {};
    this.raters = {};
};

sys.inherits(stats.Statistics, events.EventEmitter); 

stats.Statistics.prototype = {
    handleCount : function(type, identifiers) {

	if(!(this.counters.hasOwnProperty(type))) {
	    this.counters[type] = new stats.Counter();
	}
    
	for(var i = 0; i < identifiers.length; i++) {
	    this.counters[type].increment(identifiers[i]);
	}
	
    },

    handleRating : function(type, identifier, rating) {
	
	if(!this.raters.hasOwnProperty(type)) {
	    this.raters[type] = new stats.Rater();
	}
	
	this.raters[type].addRating(identifier, rating);
    }
};

stats.createBoundedWrapper = function (object, method) {
    return function() {
	return method.apply(object, arguments);
    };
};
