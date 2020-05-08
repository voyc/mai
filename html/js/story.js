/**
	class Story
	Represent one story.
**/
voyc.Story = function() {
	this.id = 0;
	this.authorid = 0;
	this.original = '';
	this.title = '';
	this.language = 'th';
	this.speakers = { x: {name: "narrator", age: 40, gender: "male"} };
	this.lines = [];
	this.words = [];
	this.meta = '';

	var url = '/svc/';
	if (window.location.origin == 'file://') {
		url = 'http://mai.voyc.com/svc';  // for local testing
	}
	this.comm = new voyc.Comm(url, 'acomm', 2, true);
	this.observer = new voyc.Observer();
	var self = this;
}

voyc.Story.prototype.replace = function(newtext) {
	this.original = newtext;
	this.title = '';
	this.speakers = { x: {name: "narrator", age: 40, gender: "male"} };
	this.lines = [];
	this.words = [];
}

voyc.Story.prototype.consolidateWords = function() {
	var a = [];
	for (var i=0; i<this.lines.length; i++) {
		a = this.combineArrays(a, this.lines[i].words);
	}
	return a;
}
voyc.Story.prototype.combineArrays = function(combined, a) {
	var c = combined;
	var matched = false;
	for (var i=0; i<a.length; i++) { // a[i] incoming
		matched = false;
		for (var j=0; j<c.length; j++) { // c[j] master
			if (c[j].t == a[i].t) {
				c[j].loc.push(voyc.clone(a[i].loc[0]));
				matched = true;
				break;
			}
		}
		if (!matched) {
			var b = voyc.clone(a[i]);
			c.push(b);
		}
	}
	return c;
}

// build array of one-syllable components from words
voyc.Story.prototype.consolidateComponents = function() {
	var cpa = voyc.cloneArray(this.words);
	var bfinished = this.explodeComponents(cpa);	
	var runaway = 10;
	while ((runaway > 0) && !bfinished) {
		runaway--;
		bfinished = this.explodeComponents(cpa);	
	}
	
	// now cpa includes a combination of word objects and fastmatch objects

	// make list of ids
	// call server getDict
	// onGetDictReceived, add dict to this.components

	return cpa; // to this.components
}

voyc.Story.prototype.explodeComponents = function(cpa) {
	var bfinished = true;
	var c = [];
	for (var i=0; i<cpa.length; i++) {
		var word = cpa[i];
		if (word.g == 'm') {
			bfinished = false;
			for (var j=0; j<word.cp.length; j++) {
				var cp = word.cp[j];
				m = voyc.dictionary.fastMatch(cp);
				if (m && !cpa.includes(m)) {
					cpa.push(m);
				}
			}
			delete cpa[i];
			i--;
		}
	}
	return bfinished;
}

voyc.Story.prototype.condenseWords = function(words) {
	var a = [];
	for (var i=0; i<words.length; i++) {
		var word = voyc.clone(words[i]);
		delete word.dict;
		delete word.vocab;
		a.push(word);
	}
	return a;
}

voyc.Story.prototype.save = function() {
	var svcname = 'setstory';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['id'] = this.id;
	data['language' ] = this.language;
	data['title' ] = this.title;
	data['original'] = this.original;
	data['words'] = JSON.stringify( this.condenseWords(this.consolidateWords(this.words)));
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}
		self.observer.publish('setstory-received', 'story', response);
		if (response['status'] == 'ok') {
			console.log('setstory success');
		}
		else {
			console.log('setstory failed');
		}
	});
	this.observer.publish('setstory-posted', 'story', {});
}

voyc.Story.prototype.read = function(id) {
	this.id = parseInt(id);
	var svcname = 'getstory';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['id'] = this.id;
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		if (response.status == 'ok') {
			var story = response.story;
			self.id       = parseInt(story.id);
			self.authorid = parseInt(story.authorid);
			self.language = story.language;
			self.title    = story.title;
			self.original = story.original;
			self.words = (story.words) ? JSON.parse(story.words) : [];
		}
		self.observer.publish(svcname+'-received', 'story', response);
	});
	this.observer.publish(svcname+'-posted', 'story', {});
}

voyc.Story.prototype.list = function() {
	this.id = parseInt(id);
	var svcname = 'getstories';
	var data = {};
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		self.observer.publish(svcname+'-received', 'story', response);
	});
	this.observer.publish(svcname+'-posted', 'story', {});
}
