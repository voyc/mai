/**
**/
voyc.Lesson = function(vocab) {
	this.vocab = vocab;  // each lesson state is stored in vocab
	this.list = voyc.lessons; // static array of lessons
	this.current = false;   // a copy of the current lesson object, saved in localStorage
	this.settings = {
		firstLessonId: this.list[0].id,
		lastLessonId: this.list[this.list.length-1].id,
	};
}

voyc.Lesson.prototype.retrieve = function() {
	var ls = localStorage.getItem('lesson');
	if (ls) {
		this.current = JSON.parse(ls);
	}
}

voyc.Lesson.prototype.store = function() {
	localStorage.setItem('lesson', JSON.stringify(this.current));
}

voyc.Lesson.prototype.getName = function() {
	return this.current.section + ':' + this.current.name;
}

voyc.Lesson.prototype.loadPreviousLessonInProgress = function() {
	// get previous lesson object from localStorage if it exists
	this.retrieve();

	// if not, recreate lesson object from vocab
	if (!this.current) {
		var prev = {w:this.settings.firstLessonId, s:-1, r:0};
		this.vocab.iterate(function(voc) {
			if (voc.t == 'l' && voc.r > prev.r) {
				prev = {w:voc.w, r:voc.r, s:voc.s};
			}
		});
		this.current = voyc.clone(this.getLessonFromId(prev.w));
		this.current.phasen = prev.s;

		// write to localStorage
		this.store();
	}
}

voyc.Lesson.prototype.getLessonFromId = function(id) {
	var lesson = false;
	for (var i=0; i<this.list.length; i++) {
		lesson = this.list[i];
		if (lesson.id == id) {
			break;
		}
	}
	return lesson;
}

voyc.Lesson.prototype.currentNdx = function() {
	var ndx = false;
	for (var i=0; i<this.list.length; i++) {
		var lesson = this.list[i];
		if (lesson.id == this.current.id) {
			ndx = i;
			break;
		}
	}
	return ndx;
}

voyc.Lesson.prototype.next = function() {
	var lesson = false;
	var ndx = this.currentNdx();
	ndx++;
	if (ndx < this.list.length) {
		lesson = this.list[ndx];
	}
	this.current = lesson;
	return lesson;
}

voyc.Lesson.prototype.isLessonFinished = function() {
	return (this.current.phasen == 'm');
}

voyc.Lesson.prototype.isLastLesson = function() {
	return (this.currentNdx() >= this.list.length-1);
}
