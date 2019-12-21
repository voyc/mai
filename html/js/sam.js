/**
	class Sam
	singleton

	Sam interacts with student and coach,
	and manages the student's study.

	Sam is short for Samantha, 
	the AI character played by Scarlett Johannson
	in the 2013 Spike Jonez movie "Her".
**/
voyc.Sam = function(chat) {
	this.chat = chat;
	this.req = {};
	this.setup();
	this.state = '';
	this.lang = 'thai';
}

voyc.Sam.prototype.setup = function() {
	this.vocab = new voyc.Vocab();
	//this.level = new voyc.Level(this.vocab);
	voyc.dictionary = new voyc.Dictionary();
	voyc.sengen = new voyc.SenGen(this.vocab);

	this.idhost = this.chat.addUser('Sam', true, false);

	this.observer = new voyc.Observer();
	var self = this;
	this.observer.subscribe( "chat-posted", 'sam', function(note) {
		console.log('on post');
		if (note.payload.userid != self.idhost) {
			self.respond(note.payload);
		}
	});
	this.observer.subscribe('login-received'   ,'sam' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('relogin-received' ,'sam' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('restart-anonymous','sam' ,function(note) { self.onAnonymous       (note);});
	this.observer.subscribe('logout-received'  ,'sam' ,function(note) { self.onLogoutReceived  (note);});
	this.observer.subscribe('getvocab-received','sam' ,function(note) { self.onGetVocabReceived(note);});
	
	this.lee = new voyc.Lee(this.chat, this.observer);
	voyc.curriculum = new voyc.Curriculum(voyc.$('curriculum'), this.observer, this.vocab);
}

voyc.intervalToString = function(ms) {
	var msPerHour  = 1000*3600;
	var msPerDay   = 1000*3600*24;
	var msPerWeek  = 1000*3600*24*7;
	var msPerMonth = 1000*3600*24*30;
	var msPerYear  = 1000*3600*24*365;
	var y = Math.floor(ms/msPerYear);
	var m = Math.floor(ms/msPerMonth);
	var w = Math.floor(ms/msPerWeek);
	var d = Math.floor(ms/msPerDay);
	var h = Math.floor(ms/msPerHour);
	var s = '';
	if (y > 0) s = y + 'years';
	else if (m > 0) s = m + 'months';
	else if (w > 0) s = w + 'weeks';
	else if (d > 0) s = d + 'days';
	else if (h > 0) s = h + 'hours';
	return s;
}

voyc.Sam.prototype.onGetVocabReceived = function() {
	// setup continued
	this.noam = new voyc.Noam(voyc.dictionary, this.vocab);
	//this.level.loadPreviousLevelInProgress();
	var interval = Date.now() - this.vocab.vocab.recency;
	//this.setupFirstLevel(interval);
}

/*
voyc.Sam.prototype.setupFirstLevel = function(interval) {
	var sInterval = voyc.intervalToString(interval);
	var level = this.level;
	if (level.currentDrill < 0) {
		// welcome new student
		level.currentDrill = 0;
		this.level.store();
		var s = 'Welcome to the jungle.';
		s += 'We recommend you start with ' + this.level.getName() + '.';
		s += 'Click go when ready.';
		this.chat.post(this.idhost, s, ['go']);
	}
	else if (this.level.isLevelFinished()) {
		// start next level
		var s = "At your last session " + sInterval + " ago, ";
		s += "you completed " + this.level.getName() + '. ';
		this.chat.post(this.idhost, s);
		
		this.level.next();
		s = 'The next level is ' + this.level.getName() + '. ';
		s += 'Click go to proceed.';
		this.chat.post(this.idhost, s, ['go']);
	}
	else if (!sInterval) {
		// restart level silently
		var s = 'Click go to continue.';
		this.chat.post(this.idhost, s, ['go']);
	}
	else {
		// restart level with confirmation
		var s = 'It has been ' + sInterval + '.';
		s += 'You were working on ' + this.level.getName() + '.';
		s += 'Click go to continue.';
		this.chat.post(this.idhost, s, ['go']);
	}

	this.state = 'ready';
}
*/

voyc.Sam.prototype.startLevel = function(id) {
	var sectionid = id.substr(0,2);
	var courseid = id.substr(2,4);
	var levelid = id.substr(6,2);
	var lvl = voyc[this.lang].course[sectionid][courseid][levelid];
	this.level = new voyc.Level(this.lang,lvl);

	// build prerequisite stacks
	if (this.level.prereq) {
		var a = this.noam.prereq(this.level.phrase);
		this.level.word = a[0];
		if (this.level.word.length > 0) {
			this.level.stacks.unshift('word-reverse');
			this.level.stacks.unshift('word');
		}
		this.level.glyph = a[1];
		if (this.level.glyph.length > 0) {
			this.level.stacks.unshift('glyph-reverse');
			this.level.stacks.unshift('glyph');
		}
	}

	// build postrequisite stacks
	if (this.level.postreq) {
		// if glyphs, collect words
		if (this.level.glyph.length > 0 && this.level.word < this.lee.setting.optStackSize) {
			var target = this.level['glyph'];
			var limit = this.lee.setting.optStackSize - this.level.word.length;
			if (limit > 0) {
				var collection = this.noam.collectWords(target, {limit:limit});
				this.level.word = this.level.word.concat(collection);
			}
		}

		// if words, generate phrases
		if (this.level.word.length > 0 && this.level.phrase < this.lee.setting.optStackSize) {
			//var collection = voyc.sengen.genSentence({count:8,shuffle:1,pattern:'',target:[]});
			//for (var i=0; i<collection.length; i++) {
			//	var w = collection[i];
			//	this.level.phrase.push(w);
			//	s += w + "<br/>";
			//}
		}
	}

	this.level.store();
	(new voyc.BrowserHistory).nav('home');
	this.startDrill(this.level);
}

voyc.Sam.prototype.startDrill = function(level) {
	this.vocab.set(level.id, 'l', level.currentDrill, 0);
	var self = this;
	this.state = 'drill';
	this.lee.drill(level, function(scores) {
		self.reportScores(scores);
	});
}

voyc.Sam.prototype.endDrill = function() {
	this.chat.changeHost('Sam');
	this.state = 'ready';
	this.level.currentDrill++;
	if (this.level.currentDrill >= this.level.stacks.length) { 
		this.endLevel();
		return;
	}
	this.vocab.set(this.level.id, 'l', this.level.currentDrill, 0);
	this.level.store();

	var drill = this.level.stacks[this.level.currentDrill];
	switch (drill) {
		case 'glyph':
			break;
		case 'word':
			this.state = 'nextstack';
			this.level.store();
			var s = 'Good job.  Let\'s try some words using these letters.<br/>';
			s += 'Click go when ready.';
			this.chat.post(this.idhost, s, ['go']);
			break;
		case 'word-reverse':
			this.state = 'nextstack';
			this.chat.post(this.idhost, 'Now the reverse.  Click go when ready.', ['go']);
			break;
		case 'phrase':
			this.state = 'nextstack';
			this.level.store();
			var s = 'Good job.  Let\'s try some phrases using these words.<br/>';
			s += 'Click go when ready.';
			this.chat.post(this.idhost, s, ['go']);
			break;
		case 'phrase-reverse':
			this.state = 'nextstack';
			this.chat.post(this.idhost, 'Now the reverse. Click go when ready.', ['go']);
			break;
	}
}

voyc.Sam.prototype.endLevel = function() {
	this.chat.changeHost('Sam');
	this.state = 'next';
	this.vocab.set(this.level.id, 'l','m',1);
	this.level.currentDrill = 'm';
	this.level.store();
	var prevLevelName = this.level.getName();
	var nextLevel = this.level.next();
	if (nextLevel) {
		this.level = new voyc.Level(this.lang,nextLevel);
		this.chat.post(this.idhost, 'Congratulations.  You have completed ' + prevLevelName + '.');
		this.chat.post(this.idhost, 'The next level is ' + this.level.getName() + '.');
		this.chat.post(this.idhost, 'Continue with next level?', ['yes', 'no']);
	}
	else {
		this.chat.post(this.idhost, 'Congratulations.  You have completed all of the levels.');
	}
}

voyc.Sam.prototype.reportScores = function(scores) {
	console.log("report scores");
	if (scores === false) {
		this.endDrill();
		return;
	}
	for (var i=0; i<scores.length; i++) {
		var score = scores[i];
		//this.vocab.set(score.key, score.type, score.state, score.ccnt);
		this.vocab.set(score.dict.t, score.dict.g, score.state, score.ccnt);
	}
	this.level.store();
}

voyc.Sam.prototype.onLoginReceived = function(note) {
	this.idguest = this.chat.addUser(note.payload.uname, false, true);
	this.chat.post(this.idhost, "Welcome back, " + note.payload.uname);
}

voyc.Sam.prototype.onLogoutReceived = function(note) {
	this.chat.post(this.idhost, "Goodbye.");
}

voyc.Sam.prototype.onAnonymous = function(note) {
	this.idguest = this.chat.addUser('Guest', false, true);
	this.chat.post(this.idhost, "Welcome to mai.voyc, the Online Language School.", []);
	this.chat.post(this.idhost, "Please login or register to begin.", []);
}
/*
state
	brand new
		are you ready for your first level?
	active
		current level
	drill in progress

	level in progress

other
	lee present: yes/no
	logged in: yes/no

groups
	language
	online marketing
	technology, javascript, php, ajax
*/

voyc.Sam.prototype.respond = function(o) {
	if (this.state ==  'drill')
		return this.lee.respond(o);

	var w = o.msg.split(/\s+/);
	switch (w[0]) {
		case 'go':
		case 'yes':
			switch (this.state) {
				case 'nextstack':
					this.startDrill(this.level);
					break;
				case 'ready':
				case 'next':
					this.startLevel(this.level.id);
					break;
				break;
			}
		case 'showalllevels':
			break;
		case 'debug':
			debugger;
			break;
		case 'no':
			this.chat.post(this.idhost, 'OK');
			break;
		case 'start':
			this.startLevel();
			break;
		case 'set':
			var r = this.setVocab(o.msg);
			this.chat.post(this.idhost, 'done');
			break;
		case 'get':
			var r = this.getVocab(o.msg);
			var s = voyc.printArray(r,voyc.breakSentence);
			this.chat.post(this.idhost, s);
			break;
		case 'sample':
			this.req.target = voyc.cloneArray(w);
			this.req.target.splice(0,1);
			break;
		case 'again':
			var r = voyc.sengen.genSentence(this.req);
			if (r.length > 0) {
				this.chat.post(this.idhost, r[0], ['again']);
			}
			else {
				this.chat.post(this.idhost, "Try a level first");
			}
			break;
		case 'translate':
			var s = o.msg.substr(10);
			var r = voyc.dictionary.translate(s);
			this.chat.post(this.idhost, r);
			break;
		case 'สวัสดี':
			this.chat.post(this.idhost, voyc.sengen.genSentence({pattern:'@howAreYou'}), ['สบาย ดี']);
			break;
		case 'sengen':
			var collection = voyc.sengen.genSentence({count:20,shuffle:1,pattern:'',target:[]});
			var s = '';
			for (var i=0; i<collection.length; i++) {
				var w = collection[i];
				s += w + "<br/>";
			}
			this.chat.post(this.idhost, s);
			break;
		case 'collect':
			// collect ด่กาหสฟว false true
			// collect พีอำทรแม false true
			// collect ไนปใๆยผฝ false true
			var target = w[1];
			var newWordsOnly = (w[2] === 'true');
			var targetGlyphsOnly = (w[3] === 'true');
			var a =this.noam.collectWords(target, {newWordsOnly:newWordsOnly, targetGlyphsOnly:targetGlyphsOnly});
			var s = '';
			for (var k in a) {
				s += (parseInt(k)+1)+'\t'+a[k].t+'\t'+a[k].e+'\t'+a[k].l+'<br/>';
			}		
			this.chat.post(this.idhost, s);
			break;
		default:
			this.chat.post(this.idhost, 'Would you like an example sentence?', ['yes', 'no']);
			break;
	}
}

/**
	process and respond to a "set" request
**/
voyc.Sam.prototype.setVocab = function(msg) {
	var r = 0;
	var c = msg.split(/\n/);
	for (var i=0; i<c.length; i++) {
		var w = c[i].split(/\s/);
		var word = w[1];
		var value = w[2];
		r += this.vocab.set(word,value,0);
	}
	return r;
}

voyc.Sam.prototype.getVocab = function(msg) {
	/** usage
		get word
		get all status
		get all all
	**/
	var r = [];
	var w = msg.split(/\s/);
	var word = w[1];
	var status = w[2];
	if (word == 'all') {
		status = (status == 'all') ? '' : status;
		var list = this.vocab.getlist(status);
		for (var i=0; i<list.length; i++) {
			e = list[i];
			var s = e.w + '\t' + e.s;
			r.push(s);
		}
	}
	else {
		var e = this.vocab.get(word);
		if (e) {
			var s = word + '\t' + e.s;
			r.push(s);
		}
	}
	return r;
}
