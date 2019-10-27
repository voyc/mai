/**
	class Sam
	singleton

	Sam interacts with student and coach,
	and manages the student's study.

	Sam is short for Samantha, 
	the AI character played by Scarlett Johannson
	in the 2013 Spike Jonez movie "Her".

	todo:
		parse.collect()
		start phase two  of lesson
		lesson schedule
			sections
			lessons
			drills
		custom drills
		review sessions
		
		draw list of lessons, highlighted by state
		let user pick a lesson
		
		at end of phase 2, end the lesson
		write lesson to vocab state m
		start new lesson
		when doing words, add a phase to reverse direction
**/
voyc.Sam = function(chat) {
	this.chat = chat;
	this.req = {};
	this.setup();
	this.phaseNames = [
		'glyph',
		'word',
		'phrase',
		'sentence',
		'story'
	];
	this.state = '';
}

voyc.Sam.prototype.setup = function() {
	this.vocab = new voyc.Vocab();
	this.lessons = new voyc.Lessons(this.vocab);
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

voyc.Sam.prototype.onGetVocabReceived = function() {
	this.noam = new voyc.Noam(voyc.dictionary, this.vocab.vocab.list);
	this.lessons.setup();
	var lesson = this.lessons.lesson;
	var s = '';
	switch (this.lessons.startState) {
		case 'w':
			s += 'You were working on ';
			break;
		case 'm':
			s += 'You recently completed ';
			s += lesson.section += ': ';
			s += lesson.name + '. ';
			this.chat.post(this.idhost, s);
			s = 'The next lesson is ';
			lesson = this.lessons.next();
			break;
		case 'u':
			s += 'Your first lesson is ';
			break;
	}
	s += lesson.section += ': ';
	s += lesson.name + '. ';
	s += 'Shall we go ahead with that?';
	this.chat.post(this.idhost, s, ['go']);
	this.state = 'ready';
}

voyc.Sam.prototype.startLesson = function() {
	this.startDrill(this.lessons.lesson, this.lessons.phasendx);
}

voyc.Sam.prototype.startDrill = function(lesson, phasendx) {
	var self = this;
	this.state = 'drill';
	this.vocab.set(this.lessons.lesson.id, 'l',this.lessons.phasendx,0);
	this.lee.drill(lesson, phasendx, function(scores) {
		self.reportScores(scores);
	});
}

voyc.Sam.prototype.endDrill = function() {
	this.chat.changeHost('Sam');
	this.state = 'ready';
	this.lessons.phasendx++;
	this.vocab.set(this.lessons.lesson.id, 'l',this.lessons.phasendx,0);
	if (this.lessons.phasendx < this.lessons.lesson.phases.length) { 
		var phase = voyc.phases[this.lessons.phasendx];
		switch (phase) {
			case 'word':
				this.state = 'collect';
				this.chat.post(this.idhost, 'Good job.  Let\'s try some words using these letters.  Click go when ready?', ['go']);
				break;
		}
	}
	else {
		this.endLesson();
	}
}

voyc.Sam.prototype.collect = function() {
	var lesson = this.lessons.lesson;
	var phasendx = this.lessons.phasendx;
	var collection = this.noam.collect(lesson.glyph);
	collection.sort(function(a,b) {
		return(a.l - b.l);
	});
	var optSetSize = 8;
	collection = collection.slice(0,optSetSize);
	collection = voyc.shuffleArray(collection);
	var s = '';
	for (var i=0; i<collection.length; i++) {
		var w = collection[i];
		lesson.word.push(w.t);
		s += w.t + "<br/>";
	}
	this.chat.post(this.idhost, s);
	this.startDrill(lesson,phasendx);
}
voyc.Sam.prototype.endLesson = function() {
	this.chat.changeHost('Sam');
	this.state = 'next';
	this.vocab.set(this.lessons.lesson.id, 'l','m',1);
	var lesson = this.lessons.next();
	if (!lesson) {
		this.chat.post(this.idhost, 'Congratulations.  You have completed all of the lessons.');
	}
	else {
		this.chat.post(this.idhost, 'Congratulations.  You have completed the lesson.');
		this.chat.post(this.idhost, 'Continue with next lesson?', ['yes', 'no']);
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
		this.vocab.set(score.key, score.type, score.state, score.ccnt);
	}
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
	var w = o.msg.split(/\s+/);
	switch (this.state) {
		case 'drill':
			return this.lee.respond(o);
			break;
		case 'collect':
			switch (w[0]) {
				case 'go':
					this.collect();
					break;
			}
			break;
		case 'ready':
			switch (w[0]) {
				case 'yes':
				case 'go':
					this.startLesson();
					break;
				case 'showalllessons':
					break;
			}
			break;
		case 'next':
			switch (w[0]) {
				case 'yes':
				case 'go':
					this.startLesson();
					break;
			}
			break;
		default:
			switch(w[0]) {
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
				case 'yes':
					if (this.converseState == 'endlesson') {
						this.startLesson();
					}
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
				default:
					this.chat.post(this.idhost, 'Would you like an example sentence?', ['yes', 'no']);
					break;
			}
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
