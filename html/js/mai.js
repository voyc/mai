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

	// set drawPage method as the callback in BrowserHistory object
	var self = this;
	new voyc.BrowserHistory('name', function(pageid) {
		var event = pageid.split('-')[0];
		self.observer.publish(event+'-requested', 'mai', {page:pageid});
	});

	// server communications
	var url = '/svc/';
	if (window.location.origin == 'file://') {
		url = 'http://mai.hagstrand.com/svc';  // for local testing
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
	//(new voyc.3).nav('home');
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

	voyc.chat = new voyc.Chat();
	voyc.chat.setup(document.getElementById('chatcontainer'));
	voyc.idhost = voyc.chat.addUser('Sam', true, false);
	voyc.idstudent = voyc.chat.addUser('Gregory', false, true);
	voyc.idcoach = voyc.chat.addUser('Pin', false, true);

	voyc.observer = new voyc.Observer();
	voyc.observer.subscribe( "ChatPost", 'tester', function(note) {
		console.log('on post');
		if (note.payload.userid != voyc.idhost) {
			if (note.payload.msg == 'yes' || note.payload.msg == 'no') {
				voyc.chat.post(voyc.idhost, 'OK');
			}
		}
	});

	voyc.chat.post(voyc.idhost, 'Good morning, John.');
	voyc.chat.post(voyc.idstudent, 'Hi Teacher.');
	voyc.chat.post(voyc.idcoach, 'Hello student.');
	voyc.chat.post(voyc.idhost, 'Are you ready to begin?', ['yes', 'no']);
}, false);
