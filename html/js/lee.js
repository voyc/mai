/**
	class Lee
	singleton

	Lee conducts the drills.
	A drill is run on a stack of flash cards.
	The drill continues until the student masters all the cards in the stack.

	Lee is named after R Lee Avery, 
	the actor who played Drill Sargeant Hartman 
	in the 1987 Stanley Kubrick Movie "Full Metal Jacket".

	structure:
		drill - start stack: priming nextCard
		choose - choose next card per algorithm
		countState - utility
		nextCard - calls choose, readDictionary
		reply - calls checkAnswer, scoreAnswer, nextCard
		checkAnswer - right or wrong?
		scoreAnswer - inc counts, call promote
		promote - change state w to m 
		readDictionary - one line call to dictionary.lookup

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
voyc.Lee = function(chat,observer) {
	this.chat = chat;
	this.observer = observer;
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

voyc.Lee.prototype.drill = function(stack,callback) {
	this.stack = stack;
	this.reportCallback = callback;
	this.ndxCard = -1;
	this.chat.changeHost(this.chatid);

	// create the scores array
	this.scores = [];

	for (var i=0; i<this.stack.data.length; i++) {
		var t = this.stack.data[i];

		if (this.stack.dictType == 'word' || this.stack.dictType == 'glyph') {
			var dict = this.readDictionary(t);
		}
		else if (this.stack.dictType == 'phrase') {
			var e = voyc.dictionary.translate(t);
			var tl = voyc.dictionary.translit(t);
			var dict = {t:t, g:'x', e:e, tl:tl};
		}
		this.scores.push({ndx:i, dict:dict, acnt:0, ccnt:0, pct:0, recency:0, state:'u', consecutive:0});
	}

	// choose the first card
	this.nextCard();
	this.state = 'typing';
}

voyc.Lee.prototype.choose = function() {
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
			chosen = incr(this.ndxCard, this.stack.data.length);
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

voyc.Lee.prototype.nextCard = function() {
	this.ndxCard = this.choose();
	if (this.ndxCard === false) {
		this.chat.post(this.chatid, "Finished.", []);
		this.reportCallback(false);
		return;
	}

	// display question
	var s = this.scores[this.ndxCard].dict.t;
	if (this.stack.direction == 'reverse') {
		s = this.scores[this.ndxCard].dict.e;
	}
	this.chat.post(this.chatid, s, []);
	console.log('next card: ' + s);
}

voyc.Lee.prototype.respond = function(o) {
	switch (this.state) {
		case 'typing':
			if (o.msg == 'dev quit drill') {
				this.chat.post(this.chatid, "Finished.", []);
				this.reportCallback(false);
				break;
			}		
			var b = this.checkAnswer(o);
			this.scoreAnswer(b);
			if (!b) {
				var s = "Nope. Try again.";
				this.chat.post(this.chatid, s, []);

				// display question
				var s = this.scores[this.ndxCard].dict.t;
				if (this.stack.direction == 'reverse') {
					s = this.scores[this.ndxCard].dict.e;
				}
				this.chat.post(this.chatid, s, []);
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
			var s = '';
			var dict = this.scores[this.ndxCard].dict;
			if (dict.g == 'g' && dict.p == 't') {
				s = dict.t + "  tone mark";
			}
			else if (dict.g == 'g' ) {
				s = dict.t + "  " + voyc.strp[dict.p] + ", " + voyc.strm[dict.m] + ", sound: " + dict.e;
			}
			else if (dict.g == 'o') {
				s = dict.t + "  " + dict.tl + "<sup>" + dict.tn + "</sup>  <i>" + voyc.pos[dict.p] + "</i> " + dict.e;
			}
			else if (dict.g == 's') {
				s = dict.t + "  symbol";
			}
			else if (dict.g == 'x') {
				s = dict.t + "  " + dict.tl + " " + dict.e;
			}
			if (this.setting.selfScore) {
				this.chat.post(this.chatid, s, ['right', 'wrong','details','mastered']);
				this.state = 'selfscore';
			}
			else {
				this.chat.post(this.chatid, s, []);
				this.nextCard();
				this.state = 'typing';
			}
			break;
		default:
			console.log('bogus state in lee respond');
			break;
	}
}

voyc.Lee.prototype.checkAnswer = function(o) {
	return (o.msg == this.scores[this.ndxCard].dict.t);
}

voyc.Lee.prototype.checkToneAnswer = function(o) {
	return (o.msg == this.scores[this.ndxCard].dict.tn);
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

voyc.Lee.prototype.promote = function (score) {
	if (!this.setting['isAutoPromote'])
		return false;

	var promoted = false;
	switch (score.state) {
		case 'w':
			if ((score.pct >= this.setting.promotePctWork 
				&& score.acnt > this.setting.promoteCntWork)
				|| score.consecutive >= this.setting.promoteCntWork) {
				score.state = 'm';
				promoted = true;
			}
			break;
		case'r':
			if (score.pct >= this.setting.promotePctReview 
				|| score.consecutive >= this.setting.promoteCntReview) {
				score.state = 'm';
				promoted = true;
			}
			break;

	}
	return promoted;
}

voyc.Lee.prototype.readDictionary = function(key) {
	return voyc.dictionary.lookup(key)[0];
}

