/**
	class Lee
	singleton

	Lee conducts the drills.
	A "drill" is run on a "stack" of flash "cards".
	The drill continues until the student masters all the cards in the stack.

	Lee is named after R Lee Avery, 
	the actor who played Drill Sargeant Hartman 
	in the 1987 Stanley Kubrick Movie "Full Metal Jacket".

	Miyagi is named after the character
	played by Pat Morita in the 1984 film "Karate Kid".

	one public method:
		drill(stack, callback)

	private methods (structure):
		respond() - state machine, conversation engine
			nextCard()
				chooseNextCard() - choose next card per algorithm
					countState() - utility used in "progressive" algorithm
				displayQuestion()
					composeQuestion()
			checkAnswer() - right or wrong?
			scoreAnswer()
				promote() - change w to m
				report() - calls the callback

	algorithms:
		selfscore: true or false
		chooseNextCard: progressive, sequential

	compose question and answer:
		t  thai
		e  english
		tl translit
		ru rules
		cp components
		t+ picture
		t+ audio
		m  consonant class
		?  vowel length
		t  typed thai	
**/
voyc.Lee = function(chat) {
	this.chat = chat;
	this.chatid = 0;
	this.stack = {};
	this.ndxCard = 0;  // index into the scores array, and into the glyph/word/phrase array
	this.reportCallback = false;
	this.lastReportRecency = 0;
	this.scores = [];  // created for each drill
	this.state = '';  // conversation state
	this.setting = {
		optStackSize:8,
		isAutoScore:true,
		isAutoDir:true,
		autoDirNth:30,
		isAutoChoose:true,
		choosePctReview:25,
		isAutoPull:true,
		minAvgPctWork:60,
		optSizeWork:3,
		maxSizeReview:10,
		isAutoPromote:true,
		promotePctWork:80,
		promoteCntWork:3,//1
		promotePctReview:90,
		promoteCntReview:6,
		askTone:false, //true,
		selfScore:false, //true,
	}
	this.chatid = this.chat.addUser('Lee', false, false);
}

/* one public method */
voyc.Lee.prototype.drill = function(stack,callback) {
	this.stack = stack;
	this.reportCallback = callback;
	this.ndxCard = -1;
	this.chat.changeHost(this.chatid);

	// create the scores array
	this.scores = [];
	for (var i=0; i<this.stack.flats.length; i++) {
		var flat = this.stack.flats[i];
		this.scores.push({ndx:i, flat:flat, acnt:0, ccnt:0, pct:0, recency:0, state:'u', consecutive:0});
	}

	// choose the first card
	this.nextCard();
	this.state = 'typing';
}

/* state machine, conversation engine */
voyc.Lee.prototype.respond = function(o) {
	switch (this.state) {
		case 'typing':
			if (o.msg == 'quit' || o.msg == 'cancel') {
				this.chat.post(this.chatid, "Stopped.", []);
				this.reportCallback(false);
				break;
			}		
			if (o.msg == 'hint') {
				var flat = this.scores[this.ndxCard].flat;
				//var s = voyc.dictionary.drawFlat(flat);
				var s = (flat.dict) ? voyc.dictionary.drawFlat(flat) : flat.t + ' ~ ' + flat.e;
				this.chat.post(this.chatid, s, []);
				this.displayQuestion(flat);
				break;
			}
			var b = this.checkAnswer(o);
			this.scoreAnswer(b);
			if (!b) {
				var s = "Nope. Try again.";
				this.chat.post(this.chatid, s, []);
				var flat = this.scores[this.ndxCard].flat;
				this.displayQuestion(flat);
			}
			else {
				if (this.setting.askTone && this.scores[this.ndxCard].dict.g == 'o') {
					this.chat.post(this.chatid,"What tone?", ['H','M','L','R','F']);
					this.state = 'tone';
				}
				else {
					this.state = 'showanswer';
					this.respond();  // danger, recursion
				}
			}
			break;
		case 'tone':
			var b = this.checkToneAnswer(o);
			if (!b) {
			}
			this.state = 'showanswer';
			this.respond();  // danger, recursion
			break;
		case 'selfscore':
			switch (o.msg) {
				case 'right':
					break;
				case 'wrong':
					break;
				case 'details':
					break;
				case 'mastered':
					break;
				default:
					console.log('bogus message in lee respond');
					break;
			}
			this.nextCard();
			this.state = 'typing';
			break;
		case 'showanswer':
			var s = 'Correct.</br/>';
			var flat = this.scores[this.ndxCard].flat;
			s += voyc.dictionary.drawFlat(flat);
			if (this.setting.selfScore) {
				this.chat.post(this.chatid, s, ['right', 'wrong','details','mastered']);
				this.state = 'selfscore';
			}
			else {
				var e = this.chat.post(this.chatid, s, []);
				this.chat.postPost(e);
				this.nextCard();
				this.state = 'typing';
			}
			break;
		default:
			console.log('bogus state in lee respond');
			break;
	}
}

/* choose the next card and display the next question */
voyc.Lee.prototype.nextCard = function() {
	this.ndxCard = this.chooseNextCard();
	if (this.ndxCard === false) {
		this.chat.post(this.chatid, "Finished.", []);
		this.reportCallback([]);
		return;
	}
	var s = this.displayQuestion( this.scores[this.ndxCard].flat);
	console.log('next card: ' + s);
}

voyc.Lee.prototype.chooseNextCard = function() {
	var chosen = false;
	function incr(n,m) {
		var r = n+1;
		if (r >= m) {
			r = 0;
		}
		return r;
	}
	switch(this.stack.algorithm) {
		case 'sequential':
			var n = this.ndxCard;
			var start = n-1;
			while (start != n) {
				var n = incr(n, this.scores.length);
				var score = this.scores[n];
				if (score.state == 'u') {
					score.state = 'w';
				}
				if (score.state != 'm') {
					chosen = n;
					break;
				}
			}
			break;
		case 'progressive':
			var cntw = this.countState('w');
			if (cntw < this.setting.optSizeWork) {
				for (var i=0; i<this.scores.length; i++) {
					var score = this.scores[i];
					if (score.state == 'u') {
						score.state = 'w';
						break;
					}
				}
			}
				
			// copy state work scores to separate array
			var workstack = [];
			for (var i=0; i<this.scores.length; i++) {
				var score = this.scores[i];
				if (score.state == 'w') {
					if (score.acnt == 0) {
						chosen = i;
						break;
					}
					workstack.push(score);
				}
			}
			if (chosen !== false) {
				break;
			}

			if (workstack.length <= 0) {
				break;
			}

			// sort array by recency
			workstack.sort(function(a,b) {
				return (a.recency - b.recency);
			});

			// delete half most recent
			var nhalf = Math.floor(workstack.length/2);
			for (i=0; i<nhalf; i++) {
				workstack.pop();
			}

			// choose random from remaining half
			var n = Math.floor(Math.random() * workstack.length);

			chosen = workstack[n].ndx;  // this.ndxCard
			break;
	}
	return chosen;
} 

voyc.Lee.prototype.countState = function(state) {
	var cnt = 0;
	for (var i=0; i<this.scores.length; i++) {
		var score = this.scores[i];
		if (score.state == state) {
			cnt++;
		}
	}
	return cnt;
}

voyc.Lee.prototype.displayQuestion = function(flat) {
	if (this.stack.class) {
		var s = flat.dict.t;
		this.chat.post(this.chatid, s, ['low','middle','high']);
	}
	else {
		var q = this.composeQuestion( flat);
		this.chat.post(this.chatid, q.s, q.o);
	}
	console.log('question displayed: ' + q.s);
}

voyc.Lee.prototype.composeQuestion = function(flat) {
	var step = this.stack.steps[this.stack.stepndx];
	var s = flat.t; //flat.dict.t;
	var o = ['hint'];
	switch (step) {
		case 'class':
			o = ['low', 'middle', 'high'];
			break;
		case 'tone':
			o = ['L','M','H','R','F'];
			break;
		case 'translate':
			break;
		case 'reverse':
			s = flat.e;
			break;
	}
	return { s:s, o:o };
}

voyc.Lee.prototype.checkAnswer = function(o) {
	var step = this.stack.steps[this.stack.stepndx];
	var b = false;
	switch (step) {
		case 'class':
			var lc = this.scores[this.ndxCard].flat.dict.cp[0];
			lc = lc.substr(0,1);
			var cls = voyc.alphabet.search(lc).m;
			if (lc == 'ห' || (lc == 'อ' && lc.length > 1)) {
				cls = 'h';
			}
			b = (o.msg.substr(0,1).toLowerCase() == cls);
			break;
		case 'tone':
			var tn = this.scores[this.ndxCard].flat.dict.cp.split(',')[4];
			b = (o.msg.toLowerCase() == tn.toLowerCase());
			break;
		case 'translate':
			//var en = this.scores[this.ndxCard].flat.mean.e;
			var en = this.scores[this.ndxCard].flat.e;
			b = (o.msg.toLowerCase().replaceAll('-', ' ') == en.toLowerCase().replaceAll('-', ' '));
			break;
		case 'reverse':
			//var th = this.scores[this.ndxCard].flat.dict.t;
			var th = this.scores[this.ndxCard].flat.t;
			b = (o.msg == th);
			break;
	}
	return b;
}

voyc.Lee.prototype.checkToneAnswer = function(o) {
	return (o.msg == this.scores[this.ndxCard].dict.tn); // fix
}

voyc.Lee.prototype.scoreAnswer = function(bool) {
	var score = this.scores[this.ndxCard];
	score.acnt++;
	if (bool) {
		score.ccnt++;
		score.consecutive++; 
	}
	else {
		score.consecutive = 0;
	}
	score.pct = Math.floor(score.ccnt/score.acnt*100);
	score.recency = Date.now();
	this.promote(score);
	this.report();
}

voyc.Lee.prototype.promote = function (score) {
	if (!this.setting['isAutoPromote'])
		return false;
	//if (this.stack.stepndx < this.stack.steps.length-1)
	//	return false;

	var promoted = false;
	switch (score.state) {
		case 'w':
			if ((score.pct >= this.setting.promotePctWork 
			&& score.acnt > this.setting.promoteCntWork)
			|| score.consecutive >= this.setting.promoteCntWork) {
				if (this.stack.stepndx < this.stack.steps.length-1)
					score.state = 'r';
				else
					score.state = 'm';
				promoted = true;
			}
			break;
	//	case'r':
	//		if (score.pct >= this.setting.promotePctReview 
	//			|| score.consecutive >= this.setting.promoteCntReview) {
	//			score.state = 'm';
	//			promoted = true;
	//		}
	//		break;
	}
	return promoted;
}

voyc.Lee.prototype.report = function() {
	var report = [];
	for (var i=0; i<this.scores.length; i++) {
		var score = this.scores[i];
		if (score.recency > this.lastReportRecency) {
			report.push(score);
		}
	}
	this.lastReportRecency = Date.now();
	this.reportCallback(report);
}

