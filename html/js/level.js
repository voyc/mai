/**
	The Level object.
	Sam creates.
	Begins life as a copy of the level of a course.
	Noam adds prereq.
		for phrases, words
		for words, glyphs
	Noam adds postreq. 
		for glyphs, words
		for words, phrases
	Lee adds scores.
**/

voyc.Level = function(lang,level) {
	this.lang = lang;

	this.phasen = 0;
	this.scores = {};

	if (level) {
		this.setup(level);
	}
}

voyc.Level.prototype.setup = function(level) {
	this.id = level.id;
	this.name = level.name;
	this.algorithm = level.algorithm;
	this.initialShuffle = level.initialShuffle;
	this.workSize = level.workSize;
	this.phases= level.phases;
	this.glyph = level.glyph;
	this.word = level.word;
	this.phrase = level.phrase;
}

voyc.Level.prototype.store = function() {
	localStorage.setItem('level', JSON.stringify(this));
}

voyc.Level.prototype.retrieve = function() {
	var level = JSON.parse(localStorage.getItem('level'));
	if (level) {
		this.setup(level);
	}
}

voyc.Level.prototype.remove = function() {
	localStorage.removeItem('level');
}

voyc.Level.prototype.getName = function() {
	var colorid = this.id.substr(6,2);
	var levelcolor = this.getLevelColorById(colorid);
	var s = levelcolor.name;
	if (this.name) {
		s += ': ' + this.name; 
	}
	return s;
}

voyc.Level.prototype.next = function() {
	var nextLevel = false;
	var sectionid = this.id.substr(0,2);
	var courseid = this.id.substr(2,4);
	var levelid = this.id.substr(6,2);
	var ndx = 0;
	for (var i=0; i<voyc.levelColors.length; i++) {
		var lc = voyc.levelColors[i];
		if (lc.id == levelid) {
			ndx = i;
		}
	}
	ndx++;
	if (ndx < voyc.levelColors.length) {
		var nextlevelid = voyc.levelColors[ndx].id;
		if (voyc[this.lang].course[sectionid][courseid][nextlevelid]) {
			nextLevel = voyc[this.lang].course[sectionid][courseid][nextlevelid];
		}
	}
	return nextLevel;
}

voyc.Level.prototype.getLevelColorById = function(id) {
	var r = false;
	voyc.levelColors.forEach(function(value,index,array) {
		if (value.id == id) {
			r = value;
		}
	});
	return r;
}

voyc.levelColors = [
	{ id:'wh', name:'White', color:'white' },
	{ id:'ye', name:'Yellow', color:'yellow' },
	{ id:'or', name:'Orange', color:'orange' },
	{ id:'gr', name:'Green', color:'green' },
	{ id:'bl', name:'Blue', color:'blue' },
	{ id:'pu', name:'Purple', color:'purple' },
	{ id:'re', name:'Red', color:'red' },
	{ id:'br', name:'Brown', color:'brown' },
	{ id:'bk', name:'Black', color:'black' },
]

