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
	this.chatid = 0;
	this.chatidguest = 0;
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

	this.chatid = this.chat.addUser('Sam', true, false);

	this.observer = new voyc.Observer();
	var self = this;
	this.observer.subscribe( "chat-posted", 'sam', function(note) {
		console.log('on post');
		if (note.payload.userid == self.chatidguest) {
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
	if (level.currentStackNdx < 0) {
		// welcome new student
		level.currentStackNdx = 0;
		this.level.store();
		var s = 'Welcome to the jungle.';
		s += 'We recommend you start with ' + this.level.getName() + '.';
		s += 'Click go when ready.';
		this.chat.post(this.chatid, s, ['go']);
	}
	else if (this.level.isLevelFinished()) {
		// start next level
		var s = "At your last session " + sInterval + " ago, ";
		s += "you completed " + this.level.getName() + '. ';
		this.chat.post(this.chatid, s);
		
		this.level.next();
		s = 'The next level is ' + this.level.getName() + '. ';
		s += 'Click go to proceed.';
		this.chat.post(this.chatid, s, ['go']);
	}
	else if (!sInterval) {
		// restart level silently
		var s = 'Click go to continue.';
		this.chat.post(this.chatid, s, ['go']);
	}
	else {
		// restart level with confirmation
		var s = 'It has been ' + sInterval + '.';
		s += 'You were working on ' + this.level.getName() + '.';
		s += 'Click go to continue.';
		this.chat.post(this.chatid, s, ['go']);
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
	this.vocab.set(level.id, 'l', level.currentStackNdx.toString());
	var self = this;
	this.state = 'drill';
	var stack = level.stacks[level.currentStackNdx];
	this.lee.drill(stack, function(scores) {
		self.reportScores(scores);
	});
}

voyc.Sam.prototype.endDrill = function() {
	this.chat.changeHost(this.chatid);
	this.state = 'ready';

	// next stack
	this.level.currentStackNdx++;
	if (this.level.currentStackNdx >= this.level.stacks.length) { 
		this.endLevel();
		return;
	}
	this.level.store();
	this.vocab.set(this.level.id, 'l', this.level.currentStackNdx.toString());

	// proceed with next stack?
	var stack = this.level.stacks[this.level.currentStackNdx];
	var s = 'Good job.<br/>';
	if (stack.direction == 'normal') {
		s += 'Let\'s try some '+stack.dictType+'s.<br/>';
	}
	else if (stack.direction == 'reverse') {
		s += 'Let\'s translate from English.<br/>';
	}
	s += 'Click go when ready.';
	this.chat.post(this.chatid, s, ['go']);
	
	// wait for user command
	this.state = 'nextstack';
}

voyc.Sam.prototype.endLevel = function() {
	this.chat.changeHost(this.chatid);
	this.state = 'next';
	this.vocab.set(this.level.id, 'l','m');
	this.level.currentStackNdx = 'm';
	this.level.store();
	var prevLevelName = this.level.getName();
	var nextLevel = this.level.next();
	if (nextLevel) {
		this.level = new voyc.Level(this.lang,nextLevel);
		var s = 'Congratulations.  You have completed level ' + prevLevelName + '.<br/>';
		s += 'The next level is ' + this.level.getName() + '.<br/>';
		s += 'Continue with next level?';
		this.chat.post(this.chatid, s, ['yes', 'no']);
	}
	else {
		this.chat.post(this.chatid, 'Congratulations.  You have completed all of the levels.');
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
		this.vocab.set(score.dict.t, score.dict.g, score.state);
	}
	this.level.store();
}

voyc.Sam.prototype.onLoginReceived = function(note) {
	this.chatidguest = this.chat.addUser(note.payload.uname, false, true);
	this.chat.post(this.chatid, "Welcome back, " + note.payload.uname);
}

voyc.Sam.prototype.onLogoutReceived = function(note) {
	this.chat.post(this.chatid, "Goodbye.");
}

voyc.Sam.prototype.onAnonymous = function(note) {
	this.chatidguest = this.chat.addUser('Guest', false, true);
	this.chat.post(this.chatid, "Welcome to mai.voyc, the Online Language School.", []);
	this.chat.post(this.chatid, "Please login or register to begin.", []);
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
			this.chat.post(this.chatid, 'OK');
			break;
		case 'start':
			this.startLevel();
			break;
		case 'set':
			this.setVocab(o.msg);
			this.chat.post(this.chatid, 'done');
			break;
		case 'get':
			var r = this.getVocab(o.msg);
			var s = voyc.printArray(r,voyc.breakSentence);
			this.chat.post(this.chatid, s);
			break;
		case 'remove':
			this.removeVocab(o.msg);
			this.chat.post(this.chatid, 'done');
		case 'sample':
			this.req.target = voyc.cloneArray(w);
			this.req.target.splice(0,1);
			break;
		case 'again':
			var r = voyc.sengen.genSentence(this.req);
			if (r.length > 0) {
				this.chat.post(this.chatid, r[0], ['again']);
			}
			else {
				this.chat.post(this.chatid, "Try a level first");
			}
			break;
		case 'translate':
			var s = o.msg.substr(10);
			var r = voyc.dictionary.translate(s);
			this.chat.post(this.chatid, r);
			break;
		case 'สวัสดี':
			this.chat.post(this.chatid, voyc.sengen.genSentence({pattern:'@howAreYou'}), ['สบาย ดี']);
			break;
		case 'sengen':
			var collection = voyc.sengen.genSentence({count:20,shuffle:1,pattern:'',target:[]});
			var s = '';
			for (var i=0; i<collection.length; i++) {
				var w = collection[i];
				s += w + "<br/>";
			}
			this.chat.post(this.chatid, s);
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
			this.chat.post(this.chatid, s);
			break;
		default:
			this.chat.post(this.chatid, 'Would you like an example sentence?', ['yes', 'no']);
			break;
	}
}

/**
	process and respond to a "set" request
**/
voyc.Sam.prototype.setVocab = function(msg) {
	// set word type state
	function validateType(type) {
		return ('gowx'.indexOf(type) > -1);
	}
	function validateState(state) {
		return ('uwrm012345'.indexOf(state) > -1);
	}
	var c = msg.split(/\n/);
	for (var i=0; i<c.length; i++) {
		var w = c[i].split(/\s/);
		// w[0] == 'set'
		var word = w[1];
		var type = w[2];
		var state = w[3];
		if (!validateType(type)) continue;
		if (!validateState(state)) continue;
		this.vocab.set(word,type,state);
	}
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

voyc.Sam.prototype.removeVocab = function(msg) {
	var w = msg.split(/\s/);
	// w[0] == 'set'
	var word = w[1];
	this.vocab.remove(word);
}
