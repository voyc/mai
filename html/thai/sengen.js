/**
	class SenGen
	singleton
	One public function: genSentence() with eleven subfunctions
	Also the constructor with calls buildSemantics()
**/
voyc.SenGen = function(vocab) {
	this.vocab = vocab;
	this.breakSentence = '<br/>';
	this.breakWord = ' ';
	this.maxSentences = 10000;
	this.target = [];
	this.orgpattern = '';
	this.buildSemantics();
	voyc.analyticLogging = false;
	this.prevtimestamp = 0;
}

voyc.SenGen.prototype.buildSemantics = function() {
	var w = voyc.semanticConventions; // input
	voyc.semantics = []; // output

	// 1. replace []
	w = w.replace(/\[/g, '$list(');
	w = w.replace(/\]/g, ')');

	// 2. replace {}
	w = w.replace(/\{/g, '$optional(');
	w = w.replace(/\}/g, ')');

	// 3. break lines into an array of named patterns
	var lines = w.split('\n');
	for (var i=0; i<lines.length; i++) {
		var m = lines[i].match(/(.*) (@.*) > (.*)/);
		if (m && m.length == 4) {
			voyc.semantics.push({pos:m[1],name:m[2],pattern:m[3]});
		}
	}
	
	// 4. name substitution
	var self = this;
	for (var i=0; i<voyc.semantics.length; i++) {
		voyc.semantics[i].pattern = voyc.semantics[i].pattern.replace(/(\@[a-zA-Z0-9]*)/g,function(str,name,offset,s) {
			var ndx = self.lookupSemantics(name);
			return voyc.semantics[ndx].pattern;
		});
	}
}

/**
	public function genSentence(options);
	@param options {object|null}
	@return {array} of strings
**/
voyc.SenGen.prototype.genSentence = function(options) {
	this.options = {
		count: 1,
		pattern: [],
		target: [],
		targetOnly: false,
		masteredOnly: false,
		shuffle: true,
		rebuild: false,
	}
	if (options) {
		for (var key in options) {
			this.options[key] = options[key];
		}
	}
	
	// process functions
	function isDuplicate(s,r) {
		return r.includes(s);
	}

	this.vocab.freeze();
	var r = [];
	voyc.semantics.forEach(function(rule) {
		if (this.options.pattern.length && this.options.pattern.indexOf(rule.name) < 0) {
			return;
		}
		if (!['sentence', 'expression', 'phrase'].includes(rule.pos)) {
			return;
		}

		var loop = 0;
		var runaway = 1000;
		var expected = 10;
		while (loop < runaway) {
			loop++;
			var sen = this.executeFunctions(rule.pattern);
			if (!isDuplicate(sen,r)) {
				r.push(sen);
			}
			if (r.length >= expected) {
				break;
			}
		}
		console.log('loop ' + loop);
	}, this);
	
	//r = this.filter(r,this.options.count);

	this.vocab.thaw();
	this.setRecency(r);
	return r;
}

voyc.SenGen.prototype.executeFunctions = function(pat) {
	// find all the functions in the input pattern
	var funcs = [];
	var pos = pat.indexOf('$');
	while (pos >= 0) {
		var m = this.findClose(pat,pos);
		funcs.push(m);
		pos = pat.indexOf('$',pos+1);
	} 

	// functions can be nested. sort so the inside functions are executed first.
	funcs.sort(function(a,b) {return a.lvl - b.lvl});

	// replace each function in the pattern with a single word
	var sen = pat;
	for (var i=0; i<funcs.length; i++) {
		var f = funcs[i];
		var s = sen.substring(f.pos,f.close+1);
		var t = sen.substring(f.pos+f.cmd.length+2,f.close);
		f.s = s;
		f.t = t;
		var r = this.callFunction(f);
		f.r = r;
		sen = sen.replace(s,r);
		var diff = s.length - r.length;
		for (var j=0; j<funcs.length; j++) {
			if (j > i) {
				var t = funcs[j];
				if (t.pos > f.pos) {
					t.pos -= diff;
				}
				if (t.close > f.pos) {
					t.close -= diff;
				}
			}
		}
	}
	sen = sen.trim();
	sen = sen.replace(/ +/g,' ');
	return sen;
}

voyc.SenGen.prototype.findClose = function(s,pos) {
	var m = s.substr(pos).match(/\$(.*?)\(/);
	var cmd = m[1];
	var start = pos + cmd.length + 2;
	var n = 1;
	var max = 1;
	for (var i=start; i<s.length; i++) {
		if (s.substr(i,1) == '(') {
			n++;
			max++;
		}
		if (s.substr(i,1) == ')') {
			n--;
		}
		if (n == 0) {
			return {
				pos:pos,
				close:i,
				lvl:max,
				cmd:cmd
			}
		}
	}
}

voyc.SenGen.prototype.selectFromList = function(s) {
	var a = s.split(' ');
	a = this.qualifyWords(a);
	var a = this.sortRecency(a);
	var n = Math.round(Math.random() * Math.min(a.length / 3, 5));
	var a = a.slice(n,n+1);
	//var a = a.slice(0,1);
	this.setRecency(a);
	return a;
}

voyc.SenGen.prototype.qualifyWords = function(a) {
	var o = [];
	a.forEach(function(w) {
		if (this.options.targetOnly && !this.options.target.includes(w)) {
			return;
		}
		var v = this.vocab.get(w);
		if (!v) {
			return;
		}
		if (this.options.masteredOnly && (v.s != 'm')) {
			return;
		}
		o.push(w);
	}, this);
	return o;
}

/**
	filter
**/
voyc.SenGen.prototype.filter = function(a,cnt) {
	var r = this.filterStatus(a);
	r = voyc.shuffleArray(r);
	r = this.sortRecency(r);
	r.splice(cnt,r.length-cnt);
	return r;
}
	
/**
	sort by recency
**/
voyc.SenGen.prototype.sortRecency = function(a) {
	// build sorted array of sentence + max recency
	var sa = [];
	for (var i=0; i<a.length; i++) {
		var w = a[i].split(' ');
		var rr = 0;
		var ro = 0;
		for (var j=0; j<w.length; j++) {
			var v = this.vocab.get(w[j]);
			if (!v) {
				if (voyc.analyticLogging) 
					console.log(['word not in vocab', w[j]]);
			}
			if (v.r > rr) {
				rr = v.r;
			}
			if (ro == 0 || v.r < ro) {
				ro = v.r;
			}
		}
		var o = {s:a[i], rr:rr, ro:ro};
		sa.push(o);
	}
	
	// sort the array, reverse order of recency (oldest first)
	sa.sort(function(a, b) {
		var r = a.rr - b.rr;
		if (r == 0) {
			r = a.ro - b.ro;
		}
		if (r == 0) {
			console.log('sortRecency equal');
		}
		return r;
	});
	
	// rebuild array of sentences
	var r = [];
	for (var i=0; i<sa.length; i++) {
		r.push(sa[i].s);
	}
	return r;
}

voyc.SenGen.prototype.getUniqueTimestamp = function() {
	var timestamp = new Date().getTime();
	if (timestamp <= this.prevtimestamp) {
		timestamp = this.prevtimestamp + 1;
	}
	this.prevtimestamp = timestamp;
	return timestamp;
}

/**
	set recency on each vocabulary word
	@input {array} vocab list
**/
voyc.SenGen.prototype.setRecency = function(a) {
	for (var i=0; i<a.length; i++) {
		var w = a[i].split(' ');
		for (var j=0; j<w.length; j++) {
			this.vocab.finger(w[j], this.getUniqueTimestamp());
		}
	}
}

/**
**/
voyc.SenGen.prototype.filterStatus = function(a) {
	var r = [];
	for (var i=0; i<a.length; i++) {
		var sen = a[i];
		var w = sen.split(' ');
		var numwords = w.length;
		var mcnt = wcnt = tcnt = 0;
		for (var j=0,q=1; j<numwords && q; j++) {
			var word = w[j];
			if (this.target.indexOf(word) >= 0) {
				tcnt++;
			}
			else if (!isNaN(parseInt(word))) {  // is number
				mcnt++;
			}
			else {
				var e = this.vocab.get(word);
				if (e) {
					if (e.s == 'm') {
						mcnt++;
					}
					if (e.s == 'w') {
						wcnt++;
					}
				}
			}
		}
		var numt = this.target.length;
		if (((numt && tcnt) || !numt) && (tcnt+mcnt == numwords)) {
			r.push(sen);
		}
		else {
			if (voyc.analyticLogging) 
				console.log(['filtered out', sen]);
		}
	}
	return r;
}

/**
	execute a function
	currently supported function names: number
**/
voyc.SenGen.prototype.callFunction = function(f) {
	var s = '';
	var a = f.t;
	var fname = f.cmd;
	var params = a.split(',');
	switch(fname) {
		case 'number':
			var args = [];
			for (var i=0; i<params.length; i++) {
				args.push(parseInt(params[i]));
			}
			s += voyc.genNumber.apply(this, args);
			break;
		case 'list':
			s += this.selectFromList(a);
			break;
		case 'optional':
			if (this.target.includes(a) || Math.random() < .5) {
				s += a;
			}
			break;
	}
	return s;
}

/**
	look up one name in the semantics table
	@input {string} tokenName
	@return {number} index into the semantics table
**/
voyc.SenGen.prototype.lookupSemantics = function(tokenName) {
	ndx = -1;
	for (var i=0; i<voyc.semantics.length; i++) {
		if (tokenName == voyc.semantics[i].name) {
			ndx = i;
			break;
		}
	}
	return ndx;
}
