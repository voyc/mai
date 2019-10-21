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
	this.lessonid = 0;  // for now, lessonid is the ndx into the voyc.lessons array
	this.drillInProgress = false;
}

voyc.Sam.prototype.setup = function() {
	this.vocab = new voyc.Vocab();
	voyc.dictionary = new voyc.Dictionary();
	voyc.sengen = new voyc.SenGen(this.vocab);
	this.idhost = this.chat.addUser('Sam', true, false);

	this.observer = new voyc.Observer();
	var self = this;
	this.observer.subscribe( "chat-posted", 'sam', function(note) {
		console.log('on post');
		if (note.payload.userid != self.idhost) {
			self.reply(note.payload);
		}
	});
	this.observer.subscribe('login-received'   ,'user' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('relogin-received' ,'user' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('restart-anonymous','user' ,function(note) { self.onAnonymous       (note);});
	this.observer.subscribe('logout-received'  ,'user' ,function(note) { self.onLogoutReceived  (note);});
	this.observer.subscribe('getvocab-received','user' ,function(note) { self.onGetVocabReceived(note);});
	
	//var e = document.getElementById('facecontainer');
	//voyc.face = new PokerFace(e);
	//voyc.face.load();
	//
	this.lee = new voyc.Lee(this.chat, this.observer);
}

voyc.Sam.prototype.onGetVocabReceived = function() {
	this.noam = new voyc.Noam(voyc.dictionary, this.vocab.vocab.list);
	//this.lessonid = this.chooseLesson();
}

voyc.Sam.prototype.chooseLesson = function() {
	// take the lowest lessonid with state of w or u
	var lessonid = false;
	var highm = false;
	for (var i=0; i<this.vocab.vocab.list.length; i++) {
		vocab = this.vocab.vocab.list[i];
		if (vocab.t != 'l') {
			continue;
		}
		if (vocab.s == 'w' || vocab.s == 'u') {
			lessonid = i;
			break;
		}
		if (vocab.s == 'm') {
			highm = i;
		}
	}
	if (lessonid === false) {
		if (highm !== false) {
			lessonid = highm + 1;
		}
		else {
			lessonid = 0;
		}
	}
	return lessonid;
}

voyc.Sam.prototype.startLesson = function(lessonid) {
	this.lessonid = lessonid || this.chooseLesson();
	var v = this.vocab.get(this.lessonid);
	if (v.s == 'u') {
		this.vocab.set(this.lessonid, 'l','w',0);
	}
	this.phase = 0;
	var phase = voyc.lessons[this.lessonid].phases[this.phase];
	if (phase == 'drill') {
		this.startDrill(voyc.lessons[this.lessonid]);
	}
}

voyc.Sam.prototype.startDrill = function(lesson) {
	var self = this;
	this.drillInProgress = true;
	this.lee.drill(lesson, function(scores) {
		self.reportScores(scores);
	});
}

voyc.Sam.prototype.endDrill = function() {
	this.chat.changeHost('Sam');
	this.drillInProgress = false;
	var lesson = voyc.lessons[this.lessonid];
	this.phase++;
	if (this.phase < lesson.phases.length) { 
		var phase = lesson.phases[this.phase];
		if (phase == 'collect') {
			this.converseState = 'collect';
			this.chat.post(this.idhost, 'Good job.  Let\'s try some words using these letters.  Ready?', ['collect']);
		}
	}
	else {
		this.endLesson();
	}
}

voyc.Sam.prototype.collect = function() {
	var lesson = {
		algorithm:'progressive',
		workSize:4,
		cards:[]
	}
	var collection = this.noam.collect();
	for (var i=0; i<collection.length; i++) {
		var w = collection[i];
		lesson.cards.push(w.t);
	}
	this.startDrill(lesson);
}
voyc.Sam.prototype.endLesson = function() {
	this.chat.changeHost('Sam');
	this.converseState = 'endlesson';
	this.vocab.set(this.lessonid, 'l','m',1);
	this.chat.post(this.idhost, 'Congratulations.  You have completed the lesson.');
	this.chat.post(this.idhost, 'Continue with next lesson?', ['yes', 'no']);
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
	this.chat.post(this.idhost, "Are you ready to begin?", ["start",'collect']);
}

voyc.Sam.prototype.onLogoutReceived = function(note) {
	this.chat.post(this.idhost, "Goodbye.");
}

voyc.Sam.prototype.onAnonymous = function(note) {
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

voyc.Sam.prototype.reply = function(o) {
	if (this.drillInProgress) {
		return this.lee.reply(o);
	}

	var w = o.msg.split(/\s+/);
	switch(w[0]) {
		case 'no':
			this.chat.post(this.idhost, 'OK');
			break;
		case 'start':
			this.startLesson();
			break;
		case 'collect':
			this.collect();
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
	
	// show emotion
	//voyc.face.setPleasure(Math.random()*100);
	//voyc.face.setFocus(Math.random()*100);
}

/**
	process and reply to a "set" request
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
