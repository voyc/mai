/**
**/
voyc.Level = function(vocab) {
	this.vocab = vocab;  // each level state is stored in vocab
	this.list = voyc.levels; // static array of levels
	this.current = false;   // a copy of the current level object, saved in localStorage
	this.settings = {
		firstLevelId: '',//;this.list[0].id,
		lastLevelId: '',//this.list[this.list.length-1].id,
	};
}

voyc.Level.prototype.retrieve = function() {
	var ls = localStorage.getItem('level');
	if (ls) {
		this.current = JSON.parse(ls);
	}
}

voyc.Level.prototype.store = function() {
	localStorage.setItem('level', JSON.stringify(this.current));
}

voyc.Level.prototype.getName = function() {
	return this.current.section + ':' + this.current.name;
}

voyc.Level.prototype.loadPreviousLevelInProgress = function() {
	// get previous level object from localStorage if it exists
	this.retrieve();

	// if not, recreate level object from vocab
	if (!this.current) {
		var prev = {w:this.settings.firstLevelId, s:-1, r:0};
		this.vocab.iterate(function(voc) {
			if (voc.t == 'l' && voc.r > prev.r) {
				prev = {w:voc.w, r:voc.r, s:voc.s};
			}
		});
		this.current = voyc.clone(this.getLevelFromId(prev.w));
		this.current.phasen = prev.s;

		// write to localStorage
		this.store();
	}
}

voyc.Level.prototype.getLevelFromId = function(id) {
	var level = false;
	for (var i=0; i<this.list.length; i++) {
		level = this.list[i];
		if (level.id == id) {
			break;
		}
	}
	return level;
}

voyc.Level.prototype.currentNdx = function() {
	var ndx = false;
	for (var i=0; i<this.list.length; i++) {
		var level = this.list[i];
		if (level.id == this.current.id) {
			ndx = i;
			break;
		}
	}
	return ndx;
}

voyc.Level.prototype.next = function() {
	var level = false;
	var ndx = this.currentNdx();
	ndx++;
	if (ndx < this.list.length) {
		level = this.list[ndx];
	}
	this.current = level;
	return level;
}

voyc.Level.prototype.isLevelFinished = function() {
	return (this.current.phasen == 'm');
}

voyc.Level.prototype.isLastLevel = function() {
	return (this.currentNdx() >= this.list.length-1);
}
