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
}

voyc.Sam.prototype.setup = function() {
	this.vocab = new voyc.Vocab();
	this.lesson = new voyc.Lesson(this.vocab);
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
	this.observer.subscribe('login-received'   ,'user' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('relogin-received' ,'user' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('restart-anonymous','user' ,function(note) { self.onAnonymous       (note);});
	this.observer.subscribe('logout-received'  ,'user' ,function(note) { self.onLogoutReceived  (note);});
	this.observer.subscribe('getvocab-received','user' ,function(note) { self.onGetVocabReceived(note);});
	
	this.lee = new voyc.Lee(this.chat, this.observer);
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
	this.lesson.loadPreviousLessonInProgress();
	var interval = Date.now() - this.vocab.vocab.recency;
	this.setupFirstLesson(interval);
}

voyc.Sam.prototype.setupFirstLesson = function(interval) {
	var sInterval = voyc.intervalToString(interval);
	var lesson = this.lesson.current;
	if (lesson.phasen < 0) {
		// welcome new student
		lesson.phasen = 0;
		this.lesson.store();
		var s = 'Welcome to the jungle.';
		s += 'We recommend you start with ' + this.lesson.getName() + '.';
		s += 'Click go when ready.';
		this.chat.post(this.idhost, s, ['go']);
	}
	else if (this.lesson.isLessonFinished()) {
		// start next lesson
		var s = "At your last session " + sInterval + " ago, ";
		s += "you completed " + this.lesson.getName() + '. ';
		this.chat.post(this.idhost, s);
		
		this.lesson.next();
		s = 'The next lesson is ' + this.lesson.getName() + '. ';
		s += 'Click go to proceed.';
		this.chat.post(this.idhost, s, ['go']);
	}
	else if (!sInterval) {
		// restart lesson silently
		var s = 'Click go to continue.';
		this.chat.post(this.idhost, s, ['go']);
	}
	else {
		// restart lesson with confirmation
		var s = 'It has been ' + sInterval + '.';
		s += 'You were working on ' + this.lesson.getName() + '.';
		s += 'Click go to continue.';
		this.chat.post(this.idhost, s, ['go']);
	}

	this.state = 'ready';
}

voyc.Sam.prototype.startLesson = function() {
	this.startDrill(this.lesson.current);
}
voyc.Sam.prototype.startLevel = function(id) {
	var sectionid = id.substr(0,2);
	var courseid = id.substr(2,4);
	var levelid = id.substr(6,2);
	var lvl = voyc.course[sectionid][courseid][levelid];
	this.startDrill(lvl);
}

voyc.Sam.prototype.startDrill = function(lesson) {
	var self = this;
	this.state = 'drill';
	this.vocab.set(lesson.id, 'l', lesson.phasen, 0);
	this.lesson.store();
	this.lee.drill(lesson, function(scores) {
		self.reportScores(scores);
	});
}

voyc.Sam.prototype.endDrill = function() {
	this.chat.changeHost('Sam');
	this.state = 'ready';
	var lesson = this.lesson.current;
	lesson.phasen++;
	if (lesson.phasen >= lesson.phases.length) { 
		this.endLesson();
		return;
	}
	this.vocab.set(lesson.id, 'l', lesson.phasen, 0);
	this.lesson.store();

	var phase = lesson.phases[lesson.phasen];
	switch (phase) {
		case 'glyph':
			break;
		case 'word':
			this.state = 'nextphase';
			var collection = this.collectWords();
			var s = 'Good job.  Let\'s try some words using these letters.<br/>';
			for (var i=0; i<collection.length; i++) {
				var w = collection[i];
				lesson.word.push(w.t);
				s += w.t + ' ' + w.tl + '<sup>' + w.tn + '</sup> ' + '<i>' + w.p + '</i> ' + w.e + '<br/>';
			}
			this.lesson.store();
			s += 'Click go when ready.';
			this.chat.post(this.idhost, s, ['go']);
			break;
		case 'word-reverse':
			this.state = 'nextphase';
			this.chat.post(this.idhost, 'Now the reverse.  Click go when ready.', ['go']);
			break;
		case 'phrase':
			this.state = 'nextphase';
			var collection = voyc.sengen.genSentence({count:8,shuffle:1,pattern:'',target:[]});
			var s = 'Good job.  Let\'s try some phrases using these words.<br/>';
			for (var i=0; i<collection.length; i++) {
				var w = collection[i];
				lesson.phrase.push(w);
				s += w + "<br/>";
			}
			this.lesson.store();
			s += 'Click go when ready.';
			this.chat.post(this.idhost, s, ['go']);
			break;
		case 'phrase-reverse':
			this.state = 'nextphase';
			this.chat.post(this.idhost, 'Now the reverse. Click go when ready.', ['go']);
			break;
	}
}

voyc.Sam.prototype.collectWords= function() {
	var lesson = this.lesson.current;
	var phasendx = lesson.phasen;
	var collection = this.noam.collectWords(lesson.glyph);
	collection.sort(function(a,b) {
		return(a.l - b.l);
	});
	var optSetSize = 8;
	collection = collection.slice(0,optSetSize);
	collection = voyc.shuffleArray(collection);
	return collection;
}

voyc.Sam.prototype.endLesson = function() {
	this.chat.changeHost('Sam');
	this.state = 'next';
	var lesson = this.lesson.current;
	this.vocab.set(lesson.id, 'l','m',1);
	lesson.phasen = 'm';
	this.lesson.store();
	var prevLessonName = this.lesson.getName();
	var lesson = this.lesson.next();
	if (lesson) {
		this.chat.post(this.idhost, 'Congratulations.  You have completed ' + prevLessonName + '.');
		this.chat.post(this.idhost, 'The next lesson is ' + this.lesson.getName() + '.');
		this.chat.post(this.idhost, 'Continue with next lesson?', ['yes', 'no']);
	}
	else {
		this.chat.post(this.idhost, 'Congratulations.  You have completed all of the lessons.');
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
	this.lesson.store();
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
		are you ready for your first lesson?
	active
		current lesson
	drill in progress

	lesson in progress

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
				case 'nextphase':
					this.startDrill(this.lesson.current);
					break;
				case 'ready':
				case 'next':
					this.startLesson();
					break;
				break;
			}
		case 'showalllessons':
			break;
		case 'noam':
			this.noam.dev(w);
			break;
		case 'debug':
			debugger;
			break;
		case 'no':
			this.chat.post(this.idhost, 'OK');
			break;
		case 'start':
			this.startLesson();
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
				this.chat.post(this.idhost, "Try a lesson first");
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
			var collection = this.noam.collectWords();
			var s = '';
			for (var i=0; i<collection.length; i++) {
				var w = collection[i];
				s += w.t + ' ' + w.tl + '<sup>' + w.tn + '</sup> ' + '<i>' + w.p + '</i> ' + w.e + '<br/>';
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
