/**
	class voyc.Mai
	@constructor
	A singleton object
*/
voyc.Mai = function () {
	if (voyc.Mai._instance) return voyc.Mai._instance;
	voyc.Mai._instance = this;
	this.setup();
}

voyc.Mai.prototype.setup = function () {
	this.observer = new voyc.Observer();
	new voyc.View();
	new voyc.User();
	new voyc.Account();
	new voyc.AccountView();
	this.chat = new voyc.Chat();
	this.chat.setup(document.getElementById('chatcontainer'));
	this.sam = new voyc.Sam(this.chat);

	// set drawPage method as the callback in BrowserHistory object
	var self = this;
	new voyc.BrowserHistory('name', function(pageid) {
		var event = pageid.split('-')[0];
		self.observer.publish(event+'-requested', 'mai', {page:pageid});
	});

	// server communications
	var url = '/svc/';
	if (window.location.origin == 'file://') {
		url = 'http://mai.voyc.com/svc';  // for local testing
	}
	this.comm = new voyc.Comm(url, 'acomm', 2, true);

	// attach app events
	var self = this;
	this.observer.subscribe('profile-requested'   ,'mai' ,function(note) { self.onProfileRequested    (note); });
	this.observer.subscribe('profile-submitted'   ,'mai' ,function(note) { self.onProfileSubmitted    (note); });
	this.observer.subscribe('setprofile-posted'   ,'mai' ,function(note) { self.onSetProfilePosted    (note); });
	this.observer.subscribe('setprofile-received' ,'mai' ,function(note) { self.onSetProfileReceived  (note); });
	this.observer.subscribe('getprofile-received' ,'mai' ,function(note) { self.onGetProfileReceived  (note); });

	this.observer.publish('setup-complete', 'mai', {});
	(new voyc.BrowserHistory).nav('home');
	
	window.addEventListener('resize', function() {
		self.resize();
	}, false);
	this.resize();
}

voyc.Mai.prototype.resize = function() {
	var top = document.querySelector('#chatcontainer').offsetTop;
	var bot = document.querySelector('footer').offsetTop;
	var ht = bot - top;
	document.querySelector('#chatcontainer').style.height = ht + 'px';
	this.chat.resize(ht);
}

voyc.Mai.prototype.onProfileRequested = function(note) {
	var svcname = 'getprofile';
	var data = {};
	data['si'] = voyc.getSessionId();
	
	// call svc
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}
		self.observer.publish('getprofile-received', 'mai', response);
	});
	this.observer.publish('getprofile-posted', 'mai', {});
}

voyc.Mai.prototype.onGetProfileReceived = function(note) {
	var response = note.payload;
	if (response['status'] == 'ok') {
		console.log('getprofile success');
		voyc.$('gender').value = response['gender'];
		voyc.$('photo' ).value = response['photo' ];
		voyc.$('phone' ).value = response['phone' ];
	}
	else {
		console.log('getprofile failed');
	}
}

voyc.Mai.prototype.onProfileSubmitted = function(note) {
	var svcname = 'setprofile';
	var inputs = note.payload.inputs;

	// build data array of name/value pairs from user input
	var data = {};
	data['si'] = voyc.getSessionId();
	data['gender'] = inputs['gender'].value;
	data['photo' ] = inputs['photo' ].value;
	data['phone' ] = inputs['phone' ].value;
	
	// call svc
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}

		self.observer.publish('setprofile-received', 'mai', response);

		if (response['status'] == 'ok') {
			console.log('setprofile success' + response['message']);
		}
		else {
			console.log('setprofile failed');
		}
	});

	this.observer.publish('setprofile-posted', 'mai', {});
}

voyc.Mai.prototype.onSetProfilePosted = function(note) {
	console.log('setprofile posted');
}

voyc.Mai.prototype.onSetProfileReceived = function(note) {
	console.log('setprofile received');
}

/* on startup */
window.addEventListener('load', function(evt) {
	voyc.mai = new voyc.Mai();
}, false);
