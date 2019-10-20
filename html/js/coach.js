/**
	class Coach
	singleton

	Coach conducts the lesson drills.
	A drill is a series of questions and answers.
	The drill continues until the student is getting all the answers correct.

	setup - only one line
	drill - start lesson: priming pull, nextQuestion
	choose - choose next question per algorithm
	countState - utility
	pull - not used
	nextQuestion - calls choose, readDictionary
	reply - calls checkAnswer, scoreAnswer, nextQuestion
	checkAnswer - right or wrong?
	scoreAnswer - inc counts, call promote
	promote - change state w to m 
	readDictionary - one line call to dictionary.lookup

	todo
		finished lesson
		report scores
		store vocab
		collect
		next lesson


**/
voyc.Coach = function(chat) {
	this.chat = chat;
	this.idguest = 1;
	this.setup();
	this.lesson = {};
	this.ndxQuestion = 0;
	this.key = '';
	this.dictEntry = {};
	this.reportCallback = false;
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

voyc.Coach.prototype.setup = function() {
	this.observer = new voyc.Observer();
}

voyc.Coach.prototype.drill = function(lesson,callback) {
	this.lesson = lesson;
	this.ndxQuestion = -1;
	this.reportCallback = callback;
	for (var i=0; i<this.lesson.questions.length; i++) {
		var q = this.lesson.questions[i];
		this.scores.push({ndx:i, key:q, acnt:0, ccnt:0, pct:0, recency:0, state:'u', consecutive:0});
	}
	this.pull();
	this.nextQuestion();
}

voyc.Coach.prototype.choose = function() {
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
			//chosen = this.ndxQuestion + 1;
			chosen = incr(this.ndxQuestion, this.lesson.questions.length);
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

voyc.Coach.prototype.countState = function(state) {
	var cnt = 0;
	for (var i=0; i<this.scores.length; i++) {
		var score = this.scores[i];
		if (score.state == state) {
			cnt++;
		}
	}
	return cnt;
}
voyc.Coach.prototype.pull = function() {
return;
	// fill workset to minimum
	var numU = this.countState('u');
	var numW = this.countState('w');
	for (var i=0; i<this.scores.length; i++) {
		var score = this.scores[i];
		if (score.state == 'u') {
			if (numW < this.setting.optSizeWork) {
				score.state = 'w';
				numU--;
				numW++;
			}
		}
	}
}

voyc.Coach.prototype.nextQuestion = function() {
	this.ndxQuestion = this.choose();
	if (this.ndxQuestion === false) {
		this.chat.post(this.idguest, "Finished.  Congratulations!", []);
		return;
	}
	this.key = this.lesson.questions[this.ndxQuestion];
	this.dictEntry = this.readDictionary(this.key);
	this.chat.post(this.idguest, this.key, []);
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

voyc.Coach.prototype.reply = function(o) {
	var b = this.checkAnswer(o);
	this.scoreAnswer(b);
	if (!b) {
		var s = "Nope. Try again.";
		this.chat.post(this.idguest, s, []);
		this.chat.post(this.idguest, this.key, []);
	}
	else {
		var s = "Correct!  " + this.key + "  " + voyc.strp[this.dictEntry.p] + ", " + voyc.strm[this.dictEntry.m] + ", sound: " + this.dictEntry.e;
		this.chat.post(this.idguest, s, []);
		this.nextQuestion();
	}
}

voyc.Coach.prototype.checkAnswer = function(o) {
	return (o.msg == this.lesson.questions[this.ndxQuestion]);
}

voyc.Coach.prototype.scoreAnswer = function(bool) {
	var score = this.scores[this.ndxQuestion];
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
	this.pull();
}

voyc.Coach.prototype.promote = function (score) {
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

voyc.Coach.prototype.readDictionary = function(key) {
	return voyc.dictionary.lookup(key)[0];
}

