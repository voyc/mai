/**
        class Coach
        singleton

        Coach conducts the lesson drills.
	A drill is a series of questions and answers.
	The drill continues until the student is getting all the answers correct.

**/
voyc.Coach = function(chat) {
        this.chat = chat;
	this.idguest = 1;
        this.setup();
	this.lesson = {};
	this.ndxQuestion = 0;
}

voyc.Coach.prototype.setup = function() {
        this.observer = new voyc.Observer();
}

voyc.Coach.prototype.drill = function(lesson,callback) {
	this.lesson = lesson;
	this.ndxQuestion = -1;
	this.scoringCallback = callback;
	this.nextQuestion();
}

voyc.Coach.prototype.nextQuestion = function() {
	var next = this.choose();
	var s = this.lesson.questions[next];
	this.chat.post(this.idguest, s, ['low class', 'middle class', 'high class']);
	this.ndxQuestion = next;
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
	}
	return chosen;
} 

voyc.Coach.prototype.reply = function(o) {
	var b = this.checkAnswer(o);
	this.scoreAnswer(b);
}

voyc.Coach.prototype.checkAnswer = function(o) {
	// get dictionary entry
	// if consonant, ask what class
	// if vowel, ask if long or short
	// if tone mark, don't ask
	return (o.msg == this.lesson[this.ndxQuestion]);
}

voyc.Coach.prototype.scoreAnswer = function(bool) {
	this.nextQuestion();
}

/*
choose
               // choose next card from work or review
                var workStack = voyc.flash.program.getStack(State.WORK, this.dir
                var reviewStack = voyc.flash.program.getStack(State.REVIEW, this
                var untriedStack = voyc.flash.program.getStack(State.UNTRIED, th

                // if untried, work, and review are empty, then user has finishe
                if (!workStack.getLength() && !reviewStack.getLength() && !untri
                        return null;
                }

                // default to workStack unless it's empty
                var stack = (workStack.getLength()) ? workStack : reviewStack;

                // apply randomness against percentage to sometimes use review
                if (workStack.getLength() && reviewStack.getLength()) {
                        var reviewPct = this.setting['choosePctReview']; // * (r
                        var r = Math.random() * 100;  // r is between 0 and 100
                        if (r < (reviewPct)) {
                                stack = reviewStack;
                        }
                }

                // get next card from the chosen stack
                next = stack.nextRandom();
                return next;


stack.nextRandom
                if (!this.getLength()) {
                        return null;
                }

                // if one card in the stack has a zero acnt, choose it
                for (var ndx=0; ndx<this.set.length; ndx++) {
                        var card = this.deck[this.set[ndx]];
                        if (card.getAcnt(this.dir) <= 0) {
                                return card;
                        }
                }

                // make a modified copy of the set
                var sortable = [];
                for (var ndx=0; ndx<this.set.length; ndx++) {
                        //sortable.push({ndx:ndx, id:this.set[ndx]});
                        var card = this.deck[this.set[ndx]];
                        sortable.push({ndx:ndx, id:this.set[ndx], seq:card.seq,
                }

                // order it by z ascending
                var self = this;
                sortable.sort(function(a,b) {
                        return self.deck[a.id].getZ(self.dir) - self.deck[b.id].
                });

                // remove the most recently used members (highest z)
                var halfSetSize = Math.floor(this.getLength()/2);
                for (var i=0; i<halfSetSize; i++) {
                        sortable.pop();
                }

                // of the remaining, pick one at random
                var len = sortable.length;
                var r = Math.random();  // a number between 0 and 1
                var n = r * len;
                n = Math.floor(n);

                // (n should now be between 0 and len-1)
                if (n < 0 || n > len-1)
                        debugger;

                var o = sortable[n];
                this.ndx = o.ndx;
                var id = o.id;
                var card = this.deck[id];
                return card;
        },

nSession = number question asked within this session

card {  for each direction: qa, aq
	state: quest['qas'] || 'u',    // state
        aCnt: quest['qaa'] || 0,  // count asked
        cCnt: quest['qac'] || 0,  // count correct
        pct: 0,                                 // percent corre
        recent: null,      // The 5 most recent answers.  A 5-by
        z: 0,              // nSession of last time this questio
}

  var customdata = {
                name:'custom',
                title:'Custom',
                reversible:true,
                language:false,
                sketch:false,
                translit:false,
                audio:false,
                db: false,
                keyinput:true,
                cards: [
                        //{q:'China', a:'Beijing'},
                ]
        };
*/
