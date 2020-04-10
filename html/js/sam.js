/**
	class Sam
	singleton

	Sam interacts with student and coach,
	and manages the student's study.

	Sam is short for Samantha, 
	the AI character played by Scarlett Johannson
	in the 2013 Spike Jonez movie "Her".
**/
voyc.Sam = function(chat) {
	this.chat = chat;
	this.chatid = 0;
	this.chatidguest = 0;
	this.req = {};
	this.setup();
	this.state = '';
	this.story = false;
	this.lang = 'thai';

	// extend Chat object to do post processing of a chat post
	voyc.Chat.prototype.postPost = function(e) {
		(new voyc.Minimal()).attachAll(e);
		(new voyc.Icon()).attachAll(e);
		(new voyc.Icon()).drawAll(e);

		//attach handler to speaker icons
		var elist = e.queryselectorall('icon[name="speaker"]');
		for (var i=0; i<elist.length; i++) {
			elist[i].addEventListener('click', function(e) {
				var s = e.currentTarget.getAttribute('text');
				var l = voyc.dictionary.lang(s);
				voyc.mai.sam.speech.speak( s,l);
			}, false);
		}
	}
}

voyc.Sam.prototype.setup = function() {
	this.vocab = new voyc.Vocab();
	voyc.dictionary = new voyc.Dictionary();
	voyc.sengen = new voyc.SenGen(this.vocab);

	this.chatid = this.chat.addUser('Sam', true, false);

	this.observer = new voyc.Observer();
	var self = this;
	this.observer.subscribe( "chat-posted", 'sam', function(note) {
		console.log('on post');
		if (note.payload.userid == self.chatidguest) {
			self.respond(note.payload);
		}
	});
	this.observer.subscribe('login-received'   ,'sam' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('relogin-received' ,'sam' ,function(note) { self.onLoginReceived   (note);});
	this.observer.subscribe('restart-anonymous','sam' ,function(note) { self.onAnonymous       (note);});
	this.observer.subscribe('logout-received'  ,'sam' ,function(note) { self.onLogoutReceived  (note);});
	this.observer.subscribe('getvocab-received','sam' ,function(note) { self.onGetVocabReceived(note);});
	
	this.lee = new voyc.Lee(this.chat, this.observer);
	this.speech = new voyc.Speech();
}

voyc.intervalToString = function(ms) {
	var msPerHour  = 1000*3600;
	var msPerDay   = 1000*3600*24;
	var msPerWeek  = 1000*3600*24*7;
	var msPerMonth = 1000*3600*24*30;
	var msPerYear  = 1000*3600*24*365;
	var y = Math.floor(ms/msPerYear);
	var m = Math.floor(ms/msPerMonth);
	var w = Math.floor(ms/msPerWeek);
	var d = Math.floor(ms/msPerDay);
	var h = Math.floor(ms/msPerHour);
	var s = '';
	if (y > 0) s = y + 'years';
	else if (m > 0) s = m + 'months';
	else if (w > 0) s = w + 'weeks';
	else if (d > 0) s = d + 'days';
	else if (h > 0) s = h + 'hours';
	return s;
}

voyc.Sam.prototype.onGetVocabReceived = function() {
	// setup continued
	this.noam = new voyc.Noam(voyc.dictionary, this.vocab);
	//this.level.loadPreviousLevelInProgress();
	var interval = Date.now() - this.vocab.vocab.recency;
	//this.setupFirstLevel(interval);
	//voyc.curriculum = new voyc.Curriculum(voyc.$('curriculum'), this.observer, this.vocab, this.noam);
	voyc.editor = new voyc.Editor(voyc.$('editor'), this.observer, this.noam);
}

/*
voyc.Sam.prototype.setupFirstLevel = function(interval) {
	var sInterval = voyc.intervalToString(interval);
	var level = this.level;
	if (level.currentStackNdx < 0) {
		// welcome new student
		level.currentStackNdx = 0;
		this.level.store();
		var s = 'Welcome to the jungle.';
		s += 'We recommend you start with ' + this.level.getName() + '.';
		s += 'Click go when ready.';
		this.chat.post(this.chatid, s, ['go']);
	}
	else if (this.level.isLevelFinished()) {
		// start next level
		var s = "At your last session " + sInterval + " ago, ";
		s += "you cleared " + this.level.getName() + '. ';
		this.chat.post(this.chatid, s);
		
		this.level.next();
		s = 'The next level is ' + this.level.getName() + '. ';
		s += 'Click go to proceed.';
		this.chat.post(this.chatid, s, ['go']);
	}
	else if (!sInterval) {
		// restart level silently
		var s = 'Click go to continue.';
		this.chat.post(this.chatid, s, ['go']);
	}
	else {
		// restart level with confirmation
		var s = 'It has been ' + sInterval + '.';
		s += 'You were working on ' + this.level.getName() + '.';
		s += 'Click go to continue.';
		this.chat.post(this.chatid, s, ['go']);
	}

	this.state = 'ready';
}
*/

voyc.Sam.prototype.startLevel = function(id) {
	var sectionid = id.substr(0,2);
	var courseid = id.substr(2,4);
	var levelid = id.substr(6,2);
	var lvl = voyc[this.lang].course[sectionid][courseid][levelid];
	this.level = new voyc.Level(this.lang,lvl);

	// vet this story
	var words = this.noam.parseStoryBySpace(this.level.phrase, {newWordsOnly:false, format:'dict'});
		
		// find new glyphs within new words
		var glyphs = this.noam.parseWordToGlyphs(words, {newGlyphsOnly:true, format:'dict'});
		this.level.glyph = this.level.glyph.concat(glyphs);
	
	
	// parse prerequisites
	if (this.level.prereq) {
		// find new words within story
		var words = this.noam.parseStoryBySpace(this.level.phrase, {newWordsOnly:true, format:'dict'});
		this.level.word = this.level.word.concat(words);
		
		// find new glyphs within new words
		var glyphs = this.noam.parseWordToGlyphs(words, {newGlyphsOnly:true, format:'dict'});
		this.level.glyph = this.level.glyph.concat(glyphs);
	}

	// collect postrequisites
	if (this.level.postreq) {
		// if glyphs, collect words
		if (this.level.glyph.length > 0 && this.level.word < this.lee.setting.optStackSize) {
			var target = this.level['glyph'];
			var limit = this.lee.setting.optStackSize - this.level.word.length;
			if (limit > 0) {
				var collection = this.noam.collectWords(target, {limit:limit, format:'word'});
				this.level.word = this.level.word.concat(collection);
			}
		}

		// if words, generate phrases
		if (this.level.word.length > 0 && this.level.phrase < this.lee.setting.optStackSize) {
			var collection = voyc.sengen.genSentence({count:8,shuffle:1,pattern:'',target:[]});
			this.level.phrase = this.level.phrase.concat(collection);
		}
	}

	//var analysis = this.noam.analyzeStory(this.level.phrase);

	this.level.initStacks();
	this.level.store();
	(new voyc.BrowserHistory).nav('home');
	this.startDrill(this.level);
}

voyc.Sam.prototype.startDrill = function(level) {
	this.vocab.set(level.id, 'l', level.currentStackNdx.toString());
	this.level.store();
	var self = this;
	this.state = 'drill';
	var stack = level.stacks[level.currentStackNdx];
	this.lee.drill(stack, function(scores) {
		self.reportScores(scores);
	});
}

voyc.Sam.prototype.endDrill = function() {
	this.chat.changeHost(this.chatid);
	this.state = 'ready';
return;
	// next stack
	this.level.currentStackNdx++;
	if (this.level.currentStackNdx >= this.level.stacks.length) { 
		this.endLevel();
		return;
	}
	this.vocab.set(this.level.id, 'l', this.level.currentStackNdx.toString());
	this.level.store();

	// proceed with next stack?
	var stack = this.level.stacks[this.level.currentStackNdx];
	var s = 'Good job.<br/>';
	if (stack.direction == 'normal') {
		s += 'Let\'s try some '+stack.dictType+'s.<br/>';
	}
	else if (stack.direction == 'reverse') {
		s += 'Let\'s translate from English.<br/>';
	}
	s += 'Click go when ready.';
	this.chat.post(this.chatid, s, ['go']);
	
	// wait for user command
	this.state = 'nextstack';
}

voyc.Sam.prototype.endLevel = function() {
	this.chat.changeHost(this.chatid);
	this.state = 'nextlevel';

	this.level.currentStackNdx = 'm';
	this.vocab.set(this.level.id, 'l', this.level.currentStackNdx.toString());
	this.level.store();

	var prevLevelName = this.level.getName();
	var nextLevel = this.level.next();
	var nextLevelName = this.level.getName(nextLevel)
	if (nextLevel) {
		var s = 'Congratulations.  You have cleared level ' + prevLevelName + '.<br/>';
		s += 'The next level is ' + nextLevelName + '.<br/>';
		s += 'Continue with next level?';
		this.chat.post(this.chatid, s, ['yes', 'no']);
	}
	else {
		this.chat.post(this.chatid, 'Congratulations.  You have cleared all of the levels.');
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
		this.vocab.set(score.dict.t, score.dict.g, score.state);
	}
}

voyc.Sam.prototype.onLoginReceived = function(note) {
	this.chatidguest = this.chat.addUser(note.payload.uname, false, true);
	this.chat.post(this.chatid, "Welcome back, " + note.payload.uname);
}

voyc.Sam.prototype.onLogoutReceived = function(note) {
	this.chat.post(this.chatid, "Goodbye.");
}

voyc.Sam.prototype.onAnonymous = function(note) {
	this.chatidguest = this.chat.addUser('Guest', false, true);
	this.chat.post(this.chatid, "Welcome to mai.voyc, the Online Language School.", []);
	this.chat.post(this.chatid, "Please login or register to begin.", []);
}

voyc.Sam.prototype.respond = function(o) {
	if (this.state ==  'drill')
		return this.lee.respond(o);

	var input = o.msg;
	var w = o.msg.split(/\s+/);
	switch (w[0]) {
		case 'go':
		case 'yes':
			switch (this.state) {
				case 'nextstack':
					this.startDrill(this.level);
					break;
				case 'ready':
				case 'nextlevel':
					this.level = this.level.next();
					this.startLevel(this.level.id);
					break;
				break;
			}
		case 'showalllevels':
			break;
		case 'debug':
			debugger;
			break;
		case 'no':
			this.chat.post(this.chatid, 'OK');
			break;
		case 'start':
			this.startLevel(this.level.id);
			break;
		case 'set':
			this.setVocab(o.msg);
			this.chat.post(this.chatid, 'done');
			break;
		case 'get':
			var r = this.getVocab(o.msg);
			var s = voyc.printArray(r,voyc.breakSentence);
			this.chat.post(this.chatid, s);
			break;
		case 'remove':
			this.removeVocab(o.msg);
			this.chat.post(this.chatid, 'done');
		case 'sample':
			this.req.target = voyc.cloneArray(w);
			this.req.target.splice(0,1);
			break;
		case 'again':
			var r = voyc.sengen.genSentence(this.req);
			if (r.length > 0) {
				this.chat.post(this.chatid, r[0], ['again']);
			}
			else {
				this.chat.post(this.chatid, "Try a level first");
			}
			break;
		case 'translate':
			var s = o.msg.substr(10);
			var r = voyc.dictionary.translate(s);
			this.chat.post(this.chatid, r);
			break;
		case 'สวัสดี':
			this.chat.post(this.chatid, voyc.sengen.genSentence({pattern:'@howAreYou'}), ['สบาย ดี']);
			break;
		case 'sengen':
			var options = {
				target: [w[1]],
				reload: (w.length > 2 && w[2] == 'reload'),
				count:20
			}
			var collection = voyc.sengen.genSentence(options);
			var s = '';
			for (var i=0; i<collection.length; i++) {
				var w = collection[i];
				s += w + "<br/>";
			}
			this.chat.post(this.chatid, s);
			break;
		case 'collect':
			// collect ด่กาหสฟว false true
			// collect พีอำทรแม false true
			// collect ไนปใๆยผฝ false true
			var target = w[1];
			var newWordsOnly = (w[2] === 'true');
			var targetGlyphsOnly = (w[3] === 'true');
			var a =this.noam.collectWords(target, {newWordsOnly:newWordsOnly, targetGlyphsOnly:targetGlyphsOnly});
			var s = '';
			for (var k in a) {
				s += (parseInt(k)+1)+'\t'+a[k].t+'\t'+a[k].e+'\t'+a[k].l+'<br/>';
			}		
			this.chat.post(this.chatid, s);
			break;
		case 'parse':
			var r = this.parseRequest(input);
			this.story = this.noam.parse(r.object,r.adj);	
			var s = this.showParse(this.story,{object:'summary'});
			this.chat.post(this.chatid, s);
			break;
		case 'show':
			var r = this.parseRequest(input);
			if (this.story) {
				var s = this.showParse(this.story, r)
				var e = this.chat.post(this.chatid, s);
				this.chat.postPost(e);
			}
			break;
		case 'drill':
			var r = this.parseRequest(input);
			var s = 'Parse a story first.';
			if (this.story) {
				this.drillParse(this.story, r)
			}
			break;
		case 'lookup':
			var r = this.parseRequest(input);
			var m = voyc.dictionary.lookup(r.object);
			var s = voyc.dictionary.compose(m);
			var e = this.chat.post(this.chatid, s);
			this.chat.postPost(e);
			break;
		case 'edit':
			var r = this.parseRequest(input);
			(new voyc.BrowserHistory).nav('editor');
			this.observer.publish('edit-requested', 'sam', {word:r.object});
			var e = this.chat.post(this.chatid, 'edit complete');
			break;
			
		default:
			this.chat.post(this.chatid, 'Would you like an example sentence?', ['yes', 'no']);
			break;
	}
}

voyc.Sam.prototype.parseRequest = function(s) {
	var w = s.split(' ');
	var verb = '';
	var adj = [];
	var object = '';
	w.forEach(function(item,index) {
		if (index == 0) {
			verb = item;
		}
		else if (item.substr(0,1) == '-') {
			var x = item.substr(1).split(':');
			var opt = x[0];
			var parm = true;
			if (x.length > 1) {
				parm = x[1];
			}
			adj[opt] = parm;
		}
		else {
			object += item + ' ';
		}
	});
	object = object.trim();
	return {
		verb:verb,
		adj:adj,
		object:object
	}
}
	
voyc.Sam.prototype.showParse = function(o,r) {
	var s = '';
	switch(r.object) {
		case 'summary':
			var cnt = voyc.countObject(o.speakers);
			if (cnt > 1) {
				s += cnt-1 + ' speakers<br/>';
			}
			if (o.lines.length > 1) {
				s += o.lines.length + ' lines<br/>';
			}
			var cntword = 0;
			var cntnew = 0;
			var cnterr = 0;
			o.words.forEach(function(item,index) {
				if (item.dict && !item.vocab) cntnew++;
				if (item.dict) cntword++;
				else cnterr++;
			});
			s += cntword + ' words, ' + cntnew + ' new<br/>';
			if (cnterr > 0) {
				s += cnterr + ' errors<br/>';
			}
			break;
		case 'words':
			for (var i=0; i<o.words.length; i++) {
				var w = o.words[i];
				if (r.adj.new && w.vocab) {
					continue;
				}
				if (r.adj.old && !w.vocab) {
					continue;
				}
				if (w.dict) {
					//s += w.text + '<br/>';
					var dict = voyc.dictionary.lookup(w.text)[0];
					s += voyc.dictionary.compose(dict);
				}
			}
			break
		case 'newvocab':
			o.words.forEach(function(item,index) {
				if (item.dict && !item.vocab) {
					s += item.text + '<br/>';
				}
			});
			break;
		case 'errors':
			o.words.forEach(function(item,index) {
				if (!item.dict) {
					s += item.text + ' ' + item.line + '.' + item.ndx + '<br/>';
				}
			});
			break;
		case 'lines':
			s += '<story ';
			if (r.adj.hint) {
				s += 'hint';
			}
			s += '>';
			for (var i=0; i<o.lines.length; i++) {
				s += this.drawLine(o.lines[i]);
			}
			s += '</story>';
			break;
		default:
			s += 'I can show errors, lines, words, or newvocab.<br/>';
	}
	return s;
}

voyc.Sam.prototype.drawLine = function(item) {
	var s = '';
	var x = item.text;
	var n = 0;
	s += '<line>';
	if (item.speaker != 'x') {
		s += item.speaker + ": ";
	}
	for (var i=0; i<x.length; i++) {
		if ((n < item.words.length) && i == item.words[n].ndx) {
			if (i > 0) {
				s += '</word>';
			}
			s += '<word ';
			if (!item.words[n].dict) {
				s += 'error ';
			}
			else if (!item.words[n].vocab) {
				s += 'newvocab ';
			}
			s += '>';
			n++;
		}
		s += x[i];
	} 
	s += '</word>';
	s += '</line>';
	return s;
}

voyc.Sam.prototype.drillParse = function(o, r) {
	var s = '';
	switch(r.object) {
		case 'words':
			var sortme = [];
			for (var i=0; i<o.words.length; i++) {
				var w = o.words[i];
				if (r.adj.new && w.vocab) {
					continue;
				}
				sortme.push(w);
			}
			var sorted = sortme.sort(function(a,b) {
				return a.text.length - b.text.length;
			});
			var stack = this.prepStack(sorted, o,r);
			var self = this;

			this.state = 'drill';
			this.lee.drill(stack, function(scores) {
				self.reportScores(scores);
			});
			break;
	}
	return;
}

voyc.Sam.prototype.prepStack = function(w, o, r) {
	var stack = o;
	o.id = 'cotravwh';
	o.prereq = false;
	o.postreq = false;
	o.algorithm = 'progressive';
	o.primaryDictType =  'word';
	o.title = 'ning botti 1';
	o.glyph = [];
	o.word = w;
	o.phrase = []; 
	o.drill = w;
	return stack;
}

/**
	process and respond to a "set" request
**/
voyc.Sam.prototype.setVocab = function(msg) {
	// set word type state
	function validateType(type) {
		return ('gowx'.indexOf(type) > -1);
	}
	function validateState(state) {
		return ('uwrm012345'.indexOf(state) > -1);
	}
	var c = msg.split(/\n/);
	for (var i=0; i<c.length; i++) {
		var w = c[i].split(/\s/);
		// w[0] == 'set'
		var word = w[1];
		var type = w[2];
		var state = w[3];
		if (!validateType(type)) continue;
		if (!validateState(state)) continue;
		this.vocab.set(word,type,state);
	}
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

voyc.Sam.prototype.removeVocab = function(msg) {
	var w = msg.split(/\s/);
	// w[0] == 'set'
	var word = w[1];
	this.vocab.remove(word);
}
