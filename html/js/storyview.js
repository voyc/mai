/**
	class StoryView\
	@constructor

	Display the story page.
**/

voyc.StoryView = function(container, noam) {
	// is singleton
	if (voyc.StoryView._instance) return voyc.StoryView._instance;
	else voyc.StoryView._instance = this;

	this.container = container;
	this.noam = noam;
	this.observer = voyc.observer;
	this.comm = voyc.comm;
	
	this.numTrans = 1;
	this.maxTrans = 5;
	this.setup();

	this.story = new voyc.Story(this.noam);
}

voyc.StoryView.prototype.setup = function() {
	this.lang = 'thai';
	var self = this;
	this.observer.subscribe('storyview-requested', 'storyview', function(note) {self.onStoryViewRequested(note);});
	this.observer.subscribe('getstories-received', 'storyview', function(note) {self.onGetStoriesReceived(note);});
	this.observer.subscribe('story-ready', 'storyview', function(note) {self.onStoryReady(note);});
}

voyc.StoryView.prototype.onStoryViewRequested = function(note) {
	this.container.innerHTML = '<p>Loading...</p>';
	// if story requested by id, draw it
	var a = note.payload.page.split('-');
	if (a.length > 1) {
		this.story.read(a[1]);
	}
	// otherwise, show the list
	else {
		this.list();
	}
}

voyc.StoryView.prototype.list = function() {
       this.id = parseInt(id);
       var svcname = 'getstories';
       var data = {};
       var self = this;
       this.comm.request(svcname, data, function(ok, response, xhr) {
               if (!ok) { response = { 'status':'system-error'}; }
               console.log(svcname + ' status ' + response['status']);
               self.observer.publish(svcname+'-received', 'storyview', response);
       });
       this.observer.publish(svcname+'-posted', 'storyview', {});
}

voyc.StoryView.prototype.onGetStoriesReceived = function(note) {
	if (note.payload.status != 'ok') {
		return;
	}
	var s = '';
	var list = note.payload.list;
	for (var i=0; i<list.length; i++) {
		s += '<p><button type="button" class="anchor" sid="'+list[i].id+'">';
		s += list[i].title;
		s += '</button></p>';
	}
	this.container.innerHTML = s;

	// attach handlers
	var self = this;
	var elist = document.getElementById('storyview').querySelectorAll('button[sid]');
	for (var i=0; i<elist.length; i++) {
		elist[i].addEventListener('click', function(e) {
			var sid = e.currentTarget.getAttribute('sid');
			(new voyc.BrowserHistory).nav('storyview-'+sid);
		}, false);
	}
}

voyc.StoryView.prototype.onStoryReady = function(note) {
	this.container.innerHTML = this.story.draw();
}
