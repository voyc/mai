/**
	class Lee
	singleton

	Lee conducts the drills.
	A drill is a series of cards.  Flash cards.
	The drill continues until the student masters all the cards.

	Lee is named after R Lee Avery, 
	the actor who played Drill Sargeant Hartman 
	in the 1987 Stanley Kubrick Movie "Full Metal Jacket".

	structure:
		drill - start lesson: priming nextCard
		choose - choose next card per algorithm
		countState - utility
		nextCard - calls choose, readDictionary
		reply - calls checkAnswer, scoreAnswer, nextCard
		checkAnswer - right or wrong?
		scoreAnswer - inc counts, call promote
		promote - change state w to m 
		readDictionary - one line call to dictionary.lookup

**/
voyc.Lee = function(chat,observer) {
	this.chat = chat;
	this.observer = observer;
	this.idhost = 1;
	this.lesson = {};
	this.ndxCard = 0;
	this.key = '';
	this.dictEntry = {};
	this.reportCallback = false;
	this.lastReportRecency = 0;
	this.scores = [];
	this.state = '';
	this.setting = {
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
		promoteCntWork:1,//3
		promotePctReview:90,
		promoteCntReview:6,
		askTone:true,
		selfScore:true,
	}
}

voyc.Lee.prototype.drill = function(lesson,phasendx,callback) {
	this.lesson = lesson;
	this.phasendx = phasendx;
	this.setting.optSizeWork = lesson.workSize;
	this.ndxCard = -1;
	this.reportCallback = callback;
	this.chat.changeHost('Lee');

	// create the scores array
	this.scores = [];
	var cards = voyc.phases[this.phasendx];
	for (var i=0; i<this.lesson[cards].length; i++) {
		var q = this.lesson[cards][i];
		var dict = this.readDictionary(q);
		this.scores.push({ndx:i, key:q, type:dict.g, acnt:0, ccnt:0, pct:0, recency:0, state:'u', consecutive:0});
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
	switch(this.lesson.algorithm) {
		case 'sequential':
			var cards = voyc.phases[this.phasendx];
			chosen = incr(this.ndxCard, this.lesson[cards].length);
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

			chosen = workstack[n].ndx;
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
		this.chat.post(this.idhost, "Finished.", []);
		this.reportCallback(false);
		return;
	}
	var cards = voyc.phases[this.phasendx];
	this.key = this.lesson[cards][this.ndxCard];
	this.dictEntry = this.readDictionary(this.key);
	this.chat.post(this.idhost, this.key, []);
	console.log('next card: ' + this.key);
}

voyc.strp = {
	c:"consonant",
	v:"vowel",
	t:"tone mark"
}
voyc.strm = {
	s:"short",
	o:"long",
	m:"middle class",
	l:"low class",
	h:"high class"
}

voyc.Lee.prototype.respond = function(o) {
	switch (this.state) {
		case 'typing':
			if (o.msg == 'dev quit drill') {
				this.chat.post(this.idhost, "Finished.", []);
				this.reportCallback(false);
				break;
			}		
			var b = this.checkAnswer(o);
			this.scoreAnswer(b);
			if (!b) {
				var s = "Nope. Try again.";
				this.chat.post(this.idhost, s, []);
				this.chat.post(this.idhost, this.key, []);
			}
			else {
				if (this.setting.askTone && this.dictEntry.g == 'o') {
					this.chat.post(this.idhost,"What tone?", ['H','M','L','R','F']);
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
			if (this.dictEntry.g == 'g' ) {
				s = this.key + "  " + voyc.strp[this.dictEntry.p] + ", " + voyc.strm[this.dictEntry.m] + ", sound: " + this.dictEntry.e;
			}
			else if (this.dictEntry.g == 'o') {
				s = this.key + "  " + this.dictEntry.tl + "<sup>" + this.dictEntry.tn + "</sup>  <i>" + this.dictEntry.p + "</i> " + this.dictEntry.e + "<br/>" + this.dictEntry.d;
			}
			else if (this.dictEntry.g == 't') {
				s = this.key + "  tone mark";
			}
			else if (this.dictEntry.g == 's') {
				s = this.key + "  symbol";
			}
			if (this.setting.selfScore) {
				this.chat.post(this.idhost, s, ['right', 'wrong','details','mastered']);
				this.state = 'selfscore';
			}
			else {
				this.chat.post(this.idhost, s, []);
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
	var cards = voyc.phases[this.phasendx];
	return (o.msg == this.lesson[cards][this.ndxCard]);
}

voyc.Lee.prototype.checkToneAnswer = function(o) {
	return (o.msg == this.dictEntry.tn);
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

