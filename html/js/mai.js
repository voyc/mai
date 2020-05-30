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
	// url for server communications
	var url = '/svc/';
	if (window.location.origin == 'file://') {
		url = 'http://mai.voyc.com/svc';  // for local testing
	}

	// instantiate user management
	new voyc.User();
	new voyc.Account();
	new voyc.AccountView();

	// instantiate utilities
	voyc.comm = new voyc.Comm(url, 'mcomm', 2, true);
	voyc.observer = new voyc.Observer();
	voyc.speech = new voyc.Speech();

	// instantiate data model
	voyc.alphabet = new voyc.Alphabet();
	voyc.vocab = new voyc.Vocab();
	voyc.dictionary = new voyc.Dictionary();
	voyc.story = new voyc.Story();

	// instantiate viewers
	voyc.editor = new voyc.Editor(voyc.$('editor'));
	voyc.storyview = new voyc.StoryView(voyc.$('story'));
	voyc.chat = new voyc.Chat();
	voyc.chat.setup(document.getElementById('chatcontainer'));

	// instantiate specialists
	voyc.sam = new voyc.Sam();
	voyc.lee = new voyc.Lee();
	voyc.noam = new voyc.Noam();
	voyc.sengen = new voyc.SenGen(voyc.vocab);

	// instantiate controller, navigation via browser history
	voyc.view = new voyc.View();
	//voyc.browserhistory = new voyc.BrowserHistory('name', function(pageid) {
	//	var event = pageid.split('-')[0];
	//	voyc.observer.publish(event+'-requested', 'mai', {page:pageid});
	//});
	voyc.hist = new voyc.Hist(function(state) {
		var event = state.page;
		voyc.observer.publish(event+'-requested', 'mai', {state});
	});

	// attach app events
	var self = this;
	voyc.observer.subscribe('profile-requested'   ,'mai' ,function(note) { self.onProfileRequested    (note); });
	voyc.observer.subscribe('profile-submitted'   ,'mai' ,function(note) { self.onProfileSubmitted    (note); });
	voyc.observer.subscribe('setprofile-posted'   ,'mai' ,function(note) { self.onSetProfilePosted    (note); });
	voyc.observer.subscribe('setprofile-received' ,'mai' ,function(note) { self.onSetProfileReceived  (note); });
	voyc.observer.subscribe('getprofile-received' ,'mai' ,function(note) { self.onGetProfileReceived  (note); });

	voyc.observer.publish('setup-complete', 'mai', {});
	voyc.hist.nav({page:'home'});
	
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
	voyc.chat.resize(ht);
}

voyc.Mai.prototype.onProfileRequested = function(note) {
	var svcname = 'getprofile';
	var data = {};
	data['si'] = voyc.getSessionId();
	
	// call svc
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}
		voyc.observer.publish('getprofile-received', 'mai', response);
	});
	voyc.observer.publish('getprofile-posted', 'mai', {});
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
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}

		voyc.observer.publish('setprofile-received', 'mai', response);

		if (response['status'] == 'ok') {
			console.log('setprofile success' + response['message']);
		}
		else {
			console.log('setprofile failed');
		}
	});

	voyc.observer.publish('setprofile-posted', 'mai', {});
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
