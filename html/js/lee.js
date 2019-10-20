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

	todo:
		finished lesson
		x report scores
		x store vocab
		collect
		next lesson


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
		promoteCntWork:3,
		promotePctReview:90,
		promoteCntReview:6,
	}
}

voyc.Lee.prototype.drill = function(lesson,callback) {
	this.lesson = lesson;
	this.ndxCard = -1;
	this.reportCallback = callback;
	this.chat.changeHost('Lee');
	for (var i=0; i<this.lesson.cards.length; i++) {
		var q = this.lesson.cards[i];
		this.scores.push({ndx:i, key:q, acnt:0, ccnt:0, pct:0, recency:0, state:'u', consecutive:0});
	}
	this.nextCard();
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
			//chosen = this.ndxCard + 1;
			chosen = incr(this.ndxCard, this.lesson.cards.length);
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
	this.key = this.lesson.cards[this.ndxCard];
	this.dictEntry = this.readDictionary(this.key);
	this.chat.post(this.idhost, this.key, []);
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

voyc.Lee.prototype.reply = function(o) {
	var b = this.checkAnswer(o);
	this.scoreAnswer(b);
	if (!b) {
		var s = "Nope. Try again.";
		this.chat.post(this.idhost, s, []);
		this.chat.post(this.idhost, this.key, []);
	}
	else {
		var s = "Correct!  " + this.key + "  " + voyc.strp[this.dictEntry.p] + ", " + voyc.strm[this.dictEntry.m] + ", sound: " + this.dictEntry.e;
		this.chat.post(this.idhost, s, []);
		this.nextCard();
	}
}

voyc.Lee.prototype.checkAnswer = function(o) {
	return (o.msg == this.lesson.cards[this.ndxCard]);
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

