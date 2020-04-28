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
	this.mm = [];

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

voyc.Story.prototype.save = function() {
	var svcname = 'setstory';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['id'] = this.id;
	data['language' ] = this.language;
	data['title' ] = this.title;
	data['original'] = this.original;
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
