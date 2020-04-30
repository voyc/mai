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
			if (c[j].id == a[i].id) {
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
		self.observer.publish('setstory-received', 'mai', response);
		if (response['status'] == 'ok') {
			console.log('setstory success');
		}
		else {
			console.log('setstory failed');
		}
	});
	this.observer.publish('setstory-posted', 'mai', {});
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
		self.observer.publish(svcname+'-received', 'mai', response);
	});
	this.observer.publish(svcname+'-posted', 'mai', {});
}

voyc.Story.prototype.list = function() {
	var svcname = 'getstories';
	var data = {};
	data['si'] = voyc.getSessionId();
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		self.observer.publish(svcname+'-received', 'mai', response);
	});
	this.observer.publish(svcname+'-posted', 'mai', {});
}
