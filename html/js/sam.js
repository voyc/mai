/**
	class Sam
	singleton

	Sam is the AI who will interact with the user.
**/
voyc.Sam = function(chat) {
	this.chat = chat;
	this.req = {};
	this.setup();
	this.lesson = false;
}

voyc.lesson1 = {
	section: 'keyboard',
	sequence: 1,
	name: 'home keys',
	algorithm: 'sequential',
	questions: ['ด','่','ก','า','ห','ส','ฟ','ว']
};

voyc.Sam.prototype.startLesson = function() {
	/*
	 	show question
		receive answer
		show followup question
		receive answer
		show followup question
		receive answer
		score
		next question
		loop

		speak
		listen
		speak
		listen
		loop

		listen
		react
		loop

		onready
			show question
		onanswer
			record answer
			show followup question
		onfinalanswer
			score
			next question
			show question

	*/
	var self = this;
	this.lesson = voyc.lesson1;
	this.coach.drill(voyc.lesson1, function(scores) {
		self.scoreLesson();
	});
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
	
	//var e = document.getElementById('facecontainer');
	//voyc.face = new PokerFace(e);
	//voyc.face.load();
	this.coach = new voyc.Coach(this.chat);
}

voyc.Sam.prototype.scoreLesson = function(scores) {
	console.log("scoring");
}

voyc.Sam.prototype.onLoginReceived = function(note) {
	var x = (new voyc.User).username
	this.idguest = this.chat.addUser('John', false, true);
	this.chat.post(this.idhost, "Hello " + note.payload.uname);
	//this.chat.post(this.idhost, voyc.sengen.genSentence({pattern:'@hello'}), ['สวัสดี']);
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
	coach present: yes/no
	logged in: yes/no

groups
	language
	online marketing
	technology, javascript, php, ajax
*/

voyc.Sam.prototype.reply = function(o) {
	if (this.lesson) {
		return this.coach.reply(o);
	}

	var w = o.msg.split(/\s+/);
	switch(w[0]) {
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
		r += this.vocab.set(word,value);
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
