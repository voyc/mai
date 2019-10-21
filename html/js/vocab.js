/**
	class Vocab
	singleton
	Maintain a list of vocabulary words.
	Each entry in the list looks like this:
		{
			w:'กิน', // word
			s:'m',  // state w/t/u/r/m
			m:0,    // mastery
			r:5702539857129 // recency timestamp
		}
**/
voyc.Vocab = function() {
	var url = '/svc/';
	if (window.location.origin == 'file://') {
		url = 'http://mai.voyc.com/svc';  // for local testing
	}
	this.comm = new voyc.Comm(url, 'acomm', 2, true);

	this.observer = new voyc.Observer();
	var self = this;
	this.observer.subscribe('login-received'   ,'user' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('relogin-received'   ,'user' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('getvocab-received'   ,'user' ,function(note) { self.onVocabReceived   (note);});
	
	this.language = 'th';
	this.timerid = null;
	this.vocab = {};
}

voyc.Vocab.prototype.onLoginReceived = function(note) {
	this.vocab = this.retrieve();
	this.readServer();
}

voyc.Vocab.prototype.onVocabReceived = function(note) {
	var serverList = note.payload.list;
	var localList = this.vocab.list;

	function findInServerList(word) {
		for (var i=0; i<serverList.length; i++) {
			if (serverList[i].w == word) {
				return serverList[i];
			}
		}
		return false;
	}

	function findInLocalList(word) {
		for (var i=0; i<localList.length; i++) {
			if (localList[i].w == word) {
				return localList[i];
			}
		}
		return false;
	}

	// loop thru local list
	var dirtyBatch = [];
	for (var i=0; i<localList.length; i++) {
		var x = localList[i];
		var m = findInServerList(x.w);
		if (m && m.recency > x.r) {
			x.m = m.m;
			x.s = m.s;
			x.r = m.r;
		}
		if (!m || m.recency < x.r) {
			dirtyBatch.push(x);
		}
	}

	// loop thru server list
	for (var i=0; i<serverList.length; i++) {
		var m = findInLocalList(serverList[i].w);
		if (!m) {
			localList.push(serverList[i]);
		}
	}
	this.updateServer(dirtyBatch);
	this.vocab.recency = Date.now();
}

voyc.Vocab.prototype.setDirty = function() {
	if (!this.timerid) {
		var self = this;
		this.timerid = setTimeout( function() {
			self.updateServer(self.prepDirtyBatch());
			self.timerid = null;
		}, (10*1000));
	}
}

voyc.Vocab.prototype.prepDirtyBatch = function() {
	var dirtyBatch = [];
	var newrecency = Date.now();
	for (var i=0; i<this.vocab.list.length; i++) {
		var m = this.vocab.list[i];
		if (m.r > this.vocab.recency) {
			dirtyBatch.push(m);
		}
	}
	this.vocab.recency = newrecency;
	return dirtyBatch;
}

voyc.Vocab.prototype.updateServer = function(dirtyBatch) {
	var svcname = 'setvocab';
	if (dirtyBatch.length <= 0) {
		return;
	}
	var list = JSON.stringify(dirtyBatch);

	// build data array of name/value pairs from user input
	var data = {};
	data['si'] = voyc.getSessionId();
	data['list'] = list;
	data['language' ] = this.language;

	// call svc
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}

		self.observer.publish('setvocab-received', 'mai', response);

		if (response['status'] == 'ok') {
			console.log('setvocab success');
		}
		else {
			console.log('setvocab failed');
		}
	});

	this.observer.publish('setvocab-posted', 'mai', {});
}

voyc.Vocab.prototype.readServer = function() {
	var svcname = 'getvocab';

	// build data array of name/value pairs from user input
	var data = {};
	data['si'] = voyc.getSessionId();
	data['language' ] = this.language;

	// call svc
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}

		self.observer.publish('getvocab-received', 'mai', response);

		if (response['status'] == 'ok') {
			console.log('getvocab success');
		}
		else {
			console.log('getvocab failed');
		}
	});

	this.observer.publish('getvocab-posted', 'mai', {});
}

voyc.Vocab.prototype.store = function() {
	localStorage.setItem('vocab', JSON.stringify(this.vocab));
	this.setDirty();
}

voyc.Vocab.prototype.retrieve = function() {
	var vocab = JSON.parse(localStorage.getItem('vocab'));
	if (!vocab) {
		vocab = {
			lang: this.language,
			recency: Date.now(),
			list: []
		};
	}
	return vocab;
}

/**
	get - read one entry from the list
	@input {string} word
	@return {object}
**/	
voyc.Vocab.prototype.get = function(word) {
	var r = false;
	for (var i=0; i<this.vocab.list.length; i++) {
		var e = this.vocab.list[i];
		if (e.w == word) {
			r = e;
			break;
		}
	}
	return r;
}

/**
	set
	insert or update one entry into the list
	@input {string} word
	@input {string} state
	@return {number} count of new entries inserted
**/	
voyc.Vocab.prototype.set = function(word, type, state, mastery) {
	var r = 0;
	var e = this.get(word);
	if (e) {
		e.s = state;
		e.r = Date.now();
		e.m = e.m + mastery;
	}
	else {
		this.vocab.list.push({w:word,t:type,s:state,r:Date.now(),m:mastery});
		r++;
	}
	this.store();
	return r;
}

/**
	getlist - return an array of entries
	@input {string} state
	@return {array}
**/	
voyc.Vocab.prototype.getlist = function(state) {
	var r = [];
	for (var i=0; i<this.vocab.list.length; i++) {
		var e = this.vocab.list[i];
		if (e.s == state || !state) {
			r.push(e);
		}
	}
	return r;
}

/**
	finger - update the recency timestamp
	@input {string} word
	@input {number} timestamp
	@return null
**/
voyc.Vocab.prototype.finger = function(word, recency) {
	var e = this.get(word);
	if (e) {
		e.r = recency;
	}
	else {
		if (voyc.analyticLogging) 
			console.log(['finger vocab word not found', word]);
	}
	this.store();
}
