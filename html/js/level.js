/**
	The Level object.
	Each course has nine levels.
	Sam creates.
	Begins life as a copy of the level of a course.
	Can have multiple stacks created by course author.
	Noam adds prereq stacks.
		for phrases, words
		for words, glyphs
	Noam adds postreq stacks. 
		for glyphs, words
		for words, phrases
**/

voyc.Level = function(lang,level) {
	this.lang = lang;
	this.id = level.id;
	this.name = level.name;
	this.primaryDictType = level.primaryDictType;
	this.prereq = level.prereq;
	this.postreq = level.postreq;
	this.glyph = level.glyph;
	this.word = level.word;
	this.phrase = level.phrase;

	this.stacks = [];
	this.primaryStackNdx = 0;
	this.currentStackNdx = 0;
}

voyc.Level.prototype.initStacks = function(level) {
	if (this.glyph.length) {
		var p = {
			dictType: 'glyph',
			direction: 'normal',
			data: this.glyph,
			primary: (this.primaryDictType == 'glyph'),
			algorithm: 'progressive',
			initialShuffle: false,
		};
		this.stacks.push(p);
	}
	if (this.word.length) {
		var p = {
			dictType: 'word',
			direction: 'normal',
			data: this.word,
			primary: (this.primaryDictType == 'word'),
			algorithm: 'progressive',
			initialShuffle: false,
		}
		this.stacks.push(p);
		var p = {
			dictType: 'word',
			direction: 'reverse',
			data: this.word,
			primary: false,
			algorithm: 'progressive',
			initialShuffle: false,
		}
		this.stacks.push(p);
	}
	if (this.phrase.length) {
		var p = {
			dictType: 'phrase',
			direction: 'normal',
			data: this.phrase,
			primary: (this.primaryDictType == 'phrase'),
			algorithm: 'sequential',
			initialShuffle: false,
		}
		this.stacks.push(p);
		var p = {
			dictType: 'phrase',
			direction: 'reverse',
			data: this.phrase,
			primary: false,
			algorithm: 'sequential',
			initialShuffle: false,
		}
		this.stacks.push(p);
	}

	// identify primary stack
	var ndx = 0;
	for (var i=0; i<this.stacks.length; i++) {
		if (this.stacks[i].primary) {
			ndx = i;
		}
	}
	this.primaryStackNdx = ndx;
	
	this.settingOverrideByAuthor();
}

voyc.Level.prototype.settingOverrideByAuthor = function() {
	// let authors override three settings on primary stack
	//     note: settings for the other stacks cannot be specified by author
	//     and these three settings are overrideable
	//     todo: allow override of all settings by author, by user
	var primaryStack = this.stacks[this.primaryStackNdx];
	if (this.algorithm) 
		primaryStack.algorithm = this.algorithm;
	if (this.initialShuffle) 
		primaryStack.initialShuffle = this.initialShuffle;
	if (this.workSize) 
		primaryStack.workSize = this.workSize;
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

voyc.Level.prototype.getName = function(level) {
	level = level || this;
	var colorid = level.id.substr(6,2);
	var levelcolor = this.getLevelColorById(colorid);
	var s = levelcolor.name;
	if (level.name) {
		s += ': ' + level.name; 
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

