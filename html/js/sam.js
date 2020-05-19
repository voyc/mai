/**
	class Sam
	singleton

	Sam interacts with student and coach,
	and manages the student's study.

	Sam is short for Samantha, 
	the AI character played by Scarlett Johannson
	in the 2013 Spike Jonez movie "Her".

	public methods
		constructor
		setup
		onGetVocabReceived - setup continued, instantiate noam & editor
		dochat
		postPost
		onLoginReceived
		onLogoutReceived
		onAnonymous
		
		onSearchReceived - state edit, search, prep?
		
		startDrill
		endDrill
		reportScores
		cmdDrill
		prepStack
		
		respond - state machine, command processor, conversational engine
		parseRequest
		
		cmdListStories
		onGetStoriesReceived
		cmdSaveStory
		cmdReadStory
		onGetStoryReceived
		prepStory
		onGetDictReceived
		showStory
		* drawLine
		* composeWord
		chooseMean
		
		
		cmdSearch
		cmdEdit
		onEditCancelled
		onSetDictReceived
		
		cmdSetVocab
		cmdGetVocab
		cmdRemoveVocab
		
		voyc.printf
		voyc.intervalToString
**/
voyc.Sam = function(chat) {
	this.chat = chat;
	this.chatid = 0;
	this.chatidguest = 0;
	this.req = {};
	this.setup();
	this.state = 'ready';
	this.stack = false;
	this.drill = false;
	this.lang = 'thai';
	this.editdict = {};
}

voyc.Sam.prototype.setup = function() {
	voyc.vocab = new voyc.Vocab();
	voyc.dictionary = new voyc.Dictionary();
	voyc.sengen = new voyc.SenGen(voyc.vocab);

	this.chatid = this.chat.addUser('Sam', true, false);

	var self = this;
	voyc.observer.subscribe( "chat-posted", 'sam', function(note) {
		console.log('on post');
		if (note.payload.userid == self.chatidguest) {
			self.respond(note.payload);
		}
	});
	voyc.observer.subscribe('login-received'   ,'sam' ,function(note) { self.onLoginReceived   (note);});
	voyc.observer.subscribe('relogin-received' ,'sam' ,function(note) { self.onLoginReceived   (note);});
	voyc.observer.subscribe('restart-anonymous','sam' ,function(note) { self.onAnonymous       (note);});
	voyc.observer.subscribe('logout-received'  ,'sam' ,function(note) { self.onLogoutReceived  (note);});
	voyc.observer.subscribe('getvocab-received','sam' ,function(note) { self.onGetVocabReceived(note);});
	voyc.observer.subscribe('search-received' ,'sam' ,function(note)  { self.onSearchReceived (note);});
	voyc.observer.subscribe('edit-cancelled'   ,'sam' ,function(note) { self.onEditCancelled   (note);});
	voyc.observer.subscribe('setdict-received' ,'sam' ,function(note) { self.onSetDictReceived (note);});
	voyc.observer.subscribe('drill-requested'  ,'sam' ,function(note) { self.onDrillRequested  (note);});
	
	this.lee = new voyc.Lee(this.chat);
	this.speech = new voyc.Speech();

	// move this to chat?
	// extend Chat object to do post processing of a chat post
	voyc.Chat.prototype.postPost = function(e) {
	        (new voyc.Minimal()).attachAll(e);
	        (new voyc.Icon()).attachAll(e);
	        (new voyc.Icon()).drawAll(e);
	}
}

voyc.Sam.prototype.onGetVocabReceived = function() {
	// setup continued
	this.noam = new voyc.Noam(voyc.dictionary, voyc.vocab);
	var interval = Date.now() - voyc.vocab.vocab.recency;

	// these two should be instantiated in mai, sam should be reserved to home window
	// noam also
	voyc.editor = new voyc.Editor(voyc.$('editor'), this.noam);
	voyc.storyview = new voyc.StoryView(voyc.$('storyview'));
	voyc.story = new voyc.Story(this.noam);
}

voyc.Sam.prototype.dochat = function(s,bpost,cb) {
	var e = this.chat.post(this.chatid, s);
	if (bpost) {
		this.chat.postPost(e);
		this.postPost(e);
	}
	if (cb) {
		cb(e);
	}
}

voyc.Sam.prototype.postPost = function(e) {
	//attach handler to speaker icons
	var elist = e.querySelectorAll('icon[name="speaker"]');
	for (var i=0; i<elist.length; i++) {
		elist[i].addEventListener('click', function(e) {
			var s = e.currentTarget.getAttribute('text');
			var l = voyc.dictionary.lang(s);
			voyc.mai.sam.speech.speak( s,l);
		}, false);
	}

	//attach handler to pencil icons
	var self = this;
	var elist = e.querySelectorAll('icon[name="pencil"]');
	for (var i=0; i<elist.length; i++) {
		elist[i].addEventListener('click', function(e) {
			var id = e.currentTarget.getAttribute('did');
			self.cmdEdit({object:id,adj:[]});
		}, false);
	}

	// attach handler to unrecognized words in story
	var elist = e.querySelectorAll('word[error]');
	for (var i=0; i<elist.length; i++) {
		elist[i].addEventListener('click', function(e) {
			var s = e.currentTarget.innerHTML;
			self.cmdEdit({object:s,adj:['new']});
		}, false);
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

voyc.Sam.prototype.onSearchReceived = function(note) {
	var flats = note.payload.flat;
	var dicts = note.payload.dict;
	if (!flats || !flats.length) {
		this.dochat('not found');
		this.state = 'ready';
		return;
	}
	switch (this.state) {
		case 'edit':
			if (dicts.length == 1) {
				voyc.observer.publish('edit-requested', 'sam', {act:'u',dict:dicts[0]});
				break;
			}
			//else, multiple results, fall thru to search
		case 'search':
			var s = voyc.dictionary.drawFlatList(flats);
			this.dochat(s,true);
			this.state = 'ready';
			break;
	}
}

voyc.Sam.prototype.startDrill = function() {
	this.state = 'drill';
	var self = this;
	this.stack.flats = this.stack.sets[this.stack.setndx];
	this.lee.drill(this.stack, function(scores) {
		self.reportScores(scores);
	});
}

voyc.Sam.prototype.endDrill = function(quit) {
	this.chat.changeHost(this.chatid);
	this.state = 'ready';
	this.dochat('Good job.');
	if (!quit) {
		this.continueDrill();
	}
}

voyc.Sam.prototype.continueDrill = function() {
	// increment through the steps
	this.stack.stepndx++;
	if (this.stack.stepndx < this.stack.steps.length) {
		var s = '';
		switch (this.stack.steps[this.stack.stepndx]) {
			case 'class': s = 'What is the class of the leading consonant?'; break;
			case 'tone': s = 'What is the tone of the syllable?'; break;
			case 'translate': s = 'Translate to English.'; break;
			case 'reverse': s = 'Reverse translate back to Thai.'; break;
		}
		s += ' Click go when ready.';
		this.state = 'nextstack';
		this.chat.post(this.chatid, s, ['go']);
	}
	// increment through the sets
	else {
		this.stack.stepndx = 0;
		this.stack.setndx++;
		if (this.stack.setndx < this.stack.sets.length) {
			this.stack.flats = this.stack.sets[this.stack.setndx];
			var s = 'Let\'s do another set.<br/>';
			s += ' Click go when ready.';
			this.state = 'nextstack';
			this.chat.post(this.chatid, s, ['go']);
		}
		// increment through the stacks
		else {
			this.stack.setndx = 0;
			this.drill.stackndx++;
			if (this.drill.stackndx < this.drill.stacks.length) {
				this.stack = this.drill.stacks[this.drill.stackndx];
				var s = 'Contratulations.  You finished the stack.  Let\'s do another.';
				s += ' Click go when ready.';
				this.state = 'nextstack';
				this.chat.post(this.chatid, s, ['go']);
			}
			else {
				this.state = 'ready';
				this.dochat('Congratulations.  You finished the drill.');
			}
		}
	}
}

voyc.Sam.prototype.reportScores = function(scores) {
	console.log("report scores");
	if (scores === false) {
		this.endDrill(true); // interrupt, stop the drill
	}
	else if (!scores.length) {
		this.endDrill(); // this step ended, proceed to next step
	}
	else {
		for (var i=0; i<scores.length; i++) {
			var score = scores[i];
			voyc.vocab.set(score.flat.dict.t, score.flat.dict.g, score.state);
		}	 
	}
}

voyc.Sam.prototype.onDrillRequested = function(note) {
	var story = note.payload.story;
	voyc.story = story;
	voyc.browserhistory.nav('home');
	this.cmdDrill(story, {verb:'drill',object:'',adj:{}});
}

/* obj:words,syllables; adj:new,continue */
voyc.Sam.prototype.cmdDrill = function(story, r) {
	if (!voyc.story) {
		this.dochat('Parse a story first.');
		return;
	}
	//if (!r.adj['continue']) {
	//	this.stack = this.prepStack(story, r);
	//	if (!this.stack) {
	//		this.dochat('Drill what?');
	//		return;
	//	}
	//}

	if (r.adj['continue']) {
		this.continueDrill();
	}

	this.drill = {
		stackndx:0,
		stacks:[],
	}	
	var stack = this.prepStack(story,{verb:'drill', object:'syllables', adj:{new:true}});
	if (stack) {
		this.drill.stacks.push(stack);
	}
	stack = this.prepStack(story,{verb:'drill', object:'words', adj:{new:true}});
	if (stack) {
		this.drill.stacks.push(stack);
	}

	this.stack = this.drill.stacks[this.drill.stackndx]
	this.startDrill();
}

voyc.Sam.prototype.prepStack = function(story,r) {
	var stack = {
		algorithm: 'progressive',
		setsize:8,
		stepndx:0,
		steps:['translate','reverse'],
		setndx:0,
	}
	var flats = [];
	switch(r.object.toLowerCase()) {
		case 'syllables':
			stack.steps = ['class','tone','translate','reverse'];
		case 'words':
			for (var i=0; i<story.words.length; i++) {
				var w = story.words[i];
				if (!w.id) {
					continue;
				}
				if (r.adj.new && w.vocab) {
					continue;
				}
				if (r.object == 'syllables' && w.dict.g != 'o') {
					continue;
				}
				if (r.object == 'words' && w.dict.g != 'm') {
					continue;
				}
				var n = parseInt(w.loc[0].n)
				n = (n > 0) ? n-1 : 0;
				flat = {
					id:w.id,
					t:w.t,
					n:n,
					dict:w.dict,
					mean:w.dict.mean[n],
					vocab:w.vocab,
				}
				flats.push(flat);
			}
			break;	
		default:
			return false;
			break;
	}

	// sort by length of thai word
	flats.sort(function(a,b) {
		return a.t.length - b.t.length;
	});

	// group words into sets
	var sizes = this.calcSetSizes(stack.setsize, flats.length);
	var sets = [];
	var s = 0;
	sets[s] = [];
	var n = 0;
	for (var i=0; i<flats.length; i++) {
		var flat = flats[i];
		sets[s].push(flat);		
		n++;
		if (n >= sizes[s] && (s+1) < sizes.length) { // start a new set
			n=0;
			s++;
			sets[s] = [];
		}
	}
	stack.sets = sets;
	return stack;
}

/* calc set sizes given optimal setsize and total */
voyc.Sam.prototype.calcSetSizes = function(optsetsize, total) {
	var setsize = optsetsize;
	var q = Math.floor(total/setsize);
	var r = total % setsize;
	var h = setsize/2;
	var adj = 0;
	var n = 0;
	var numsets = 0;
	var sizes = [];
	if (q == 0) {
		numsets = 1;
		sizes.push(total);
	}
	else {
		if (r > h) {
			numsets = q+1;
			adj = -1;
			n = setsize - r;
		}
		else {
			numsets = q;
			adj = 1;
			n = r;
		}
		if (n > numsets) {
			setsize = Math.floor(total/numsets);
			n = total - (setsize * numsets);	
			adj = 1;
		}
		for (var j=0; j<numsets; j++) {
			var x = setsize;
			if (j < n) {
				x += adj;
			}
			sizes.push(x);
		}
	}
	return sizes;
}


/* respond to chat commands, state machine, command processor */
voyc.Sam.prototype.respond = function(o) { // input o object comes from chat engine
	var req = this.parseRequest(o.msg);
	var w = o.msg.split(/\s+/); // todo: replace all references to w and o.msg to req
	
	if (this.state ==  'drill' && req.verb != 'kill') {
		return this.lee.respond(o);
	}

	switch (req.verb) {
		case 'go':
		case 'yes':
			switch (this.state) {
				case 'nextstack':
					this.startDrill();
					break;
				break;
			}
			break;
		case 'debug':
			debugger;
			break;
		case 'no':
			this.chat.post(this.chatid, 'OK');
			break;
		case 'set':
			this.cmdSetVocab(req);
			this.chat.post(this.chatid, 'done');
			break;
		case 'get':
			var r = this.cmdGetVocab(req);
			var s = voyc.printArray(r,voyc.breakSentence);
			this.chat.post(this.chatid, s);
			break;
		case 'remove':
			this.cmdRemoveVocab(req);
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

		// new commands following

		case 'list':
			this.cmdListStories(req);
			break;
		case 'parse':
			if (req.adj['syllable']) {
				var po = this.noam.parse(req.object,req.adj);	
				var s = this.showStory(po,{object:'syllable'});
				this.dochat(s);
				break;
			}
			voyc.story.original = req.object;
			voyc.story.parse(voyc.story.id);
			break;
		case 'replace':
			voyc.story.replace(req.object);
			voyc.story.parse(voyc.story.id);
			this.prepStory(voyc.story);
			break;
		case 'show':
			if (req.object == 'alphabet') {
				var s = voyc.alphabet.listAll();
				this.dochat(s);
			}
			if (voyc.story) {
				var s = this.showStory(voyc.story, req)
				this.dochat(s,true,function(e) {
					var list = e.querySelectorAll('button[line]');
					for (var i=0; i<list.length; i++) {
						list[i].addEventListener('click', function(btn) {
							console.log('button clicked');
							var linenum = btn.currentTarget.getAttribute('line');
							var elline = e.querySelector('line[num="'+linenum+'"]');
							var hint = elline.getAttribute('hint');
							hint++;
							if (hint>=4) hint = 0;
							elline.setAttribute('hint',hint);
						}, true);
					}
					var list = e.querySelectorAll('story line word');
					for (var i=0; i<list.length; i++) {
						list[i].addEventListener('click', function(clk) {
							console.log('word clicked');
							var wrd = clk.currentTarget;
							var wid = wrd.getAttribute('wid');
							var w = wid.split('.');
							var did =  parseInt(w[0]);
							var line=  parseInt(w[1]);
							var wndx = parseInt(w[2]);
							var word = voyc.mai.sam.story.lines[line-1].words[wndx];
							var s = voyc.mai.sam.composeWord(word,req,wid);
							var sel = document.querySelector('form#worddetails div#details');
							sel.innerHTML = s;
							voyc.cheat = wrd;
							(new voyc.Minimal()).openPopup('worddetails');
							(new voyc.Minimal()).attachAll(sel);
							(new voyc.Icon()).attachAll(sel);
							(new voyc.Icon()).drawAll(sel);
							// attach handlers 	
							var opts = sel.querySelectorAll('button[mm]');
							for (var i=0; i<opts.length; i++) {
								opts[i].addEventListener('click',function(e) {
									var wid= e.currentTarget.getAttribute('wid');
									var mm = e.currentTarget.getAttribute('mm');
									voyc.mai.sam.chooseMean(e,mm,wid);
									(new voyc.Minimal).closePopup();
								}, false);
							}
						}, false);
					}
				});
			}
			break;
		case 'drill': 
			voyc.story = voyc.storyview.story;
			this.cmdDrill(voyc.story, req); 
			break;
		case 'search':
			this.cmdSearch(req);
			break;
		case 'edit':
			this.cmdEdit(req);
			break;
		case 'save':
			this.cmdSaveStory(req);
			break;
		case 'read':
			this.cmdReadStory(req);
			break;
		case 'reload':
			voyc.dictionary.getFast();
			break;
		case 'getcomps':
			voyc.story.getComps();
			break;
		case 'dostorycomps':
			voyc.story.doComps();
			break;
		case 'kill':
			this.state = 'ready';
			this.dochat('ready');
			break;
			
		default:
			this.chat.post(this.chatid, 'Would you like an example sentence?', ['yes', 'no']);
			break;
	}
}

voyc.Sam.prototype.parseRequest = function(s) {
	var w = s.split(' ');
	var verb = '';
	var adj = {};
	var adv = {};
	var object = '';
	w.forEach(function(item,index) {
		if (index == 0) {
			verb = item.toLowerCase();
		}
		else if (item.substr(0,1) == '-') {
			var x = item.substr(1).split(':');
			var opt = x[0].toLowerCase();
			var parm = (x.length>1) ? x[1] : true;
			if (object.length) {
				adv[opt] = parm;
			}
			else {
				adj[opt] = parm;
			}
		}
		else {
			object += item + ' ';
		}
	});
	object = object.trim();
	return {
		verb:verb,
		adj:adj,
		object:object,
		adv:adv
	}
}
	
voyc.Sam.prototype.cmdListStories = function(r) {
	var s = voyc.story.list();
}

voyc.Sam.prototype.cmdSaveStory = function(r) {
	if (voyc.story) {
		voyc.story.save();
	}
}

voyc.Sam.prototype.cmdReadStory = function(r) {
	voyc.story.read(r.object);
}

voyc.Sam.prototype.onGetStoryReceived = function(note) {
	if (note.payload.status == 'ok') {
		voyc.story.parse(voyc.story.id);	
	}
	else {
		this.dochat('not found');
	}
}

// get a miniDict for all the words in the story
voyc.Sam.prototype.prepStory = function(story) {
	var ids = [];
	for (var i=0; i<story.words.length; i++) {
		var id = story.words[i].id;
		if (id) {
			ids.push(id);
		}
	}
	voyc.dictionary.getDict(ids);
}
voyc.Sam.prototype.onGetDictReceived = function(note) {
	// add dict info to lines and words
	for (var i=0; i<voyc.story.words.length; i++) {
		var item = voyc.story.words[i];
		item.dict = voyc.dictionary.miniDict(item.id);
	}
	for (var i=0; i<voyc.story.lines.length; i++) {
		var line = voyc.story.lines[i];
		for (var j=0; j<line.words.length; j++) {
			var word = line.words[j];
			word.dict = voyc.dictionary.miniDict(word.id);
		}
	}
	var s = this.showStory(voyc.story,{object:'summary'});
	this.dochat(s);
}

voyc.Sam.prototype.showStory = function(o,r) {
	var s = '';
	switch(r.object) {
		case 'summary':
			s += o.title + '<br/>';
			var cnt = voyc.countObject(o.speakers);
			if (cnt > 1) {
				s += cnt-1 + ' speakers<br/>';
			}
			if (o.lines.length > 1) {
				s += o.lines.length + ' lines<br/>';
			}
			var cntword = 0;
			var cntcomp = 0;
			var cntwordnew = 0;
			var cntcompnew = 0;
			var cnterr = 0;
			o.words.forEach(function(item,index) {
				if (item.comp) cntcomp++;
				if (item.comp && !item.vocab) cntcompnew++;
				if (item.id && !item.vocab) cntwordnew++;
				if (item.id) cntword++;
				else cnterr++;
			});
			s += cntword + ' words (' + cntwordnew + ' new)<br/>';
			s += cntcomp + ' comps (' + cntcompnew + ' new)<br/>';
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
				if (r.adj.comp && !w.comp) {
					continue;
				}
				if (w.id) {
					s += w.dict.t + '<br/>';
				}
			}
			break
		case 'newvocab':
			o.words.forEach(function(item,index) {
				if (item.id && !item.vocab) {
					s += item.dict.t + '<br/>';
				}
			});
			break;
		case 'errors':
			o.words.forEach(function(item,index) {
				if (!item.id) {
					s += item.t + ' ' + item.loc[0].line + ',' + item.loc[0].tndx + '<br/>';
				}
			});
			break;
		case 'lines':
			s += '<story ';
			if (r.adj.author) {
				s += 'author';
			}
			if (r.adj.hint) {
				s += ' hint';
			}
			s += '>';
			for (var i=0; i<o.lines.length; i++) {
				s += this.drawLine(r,o.lines[i]);
			}
			s += '</story>';
			break;
		case 'syllable':
			var lb = '<br/>';
			s += 'leading consonant: '+o.lc+lb;
			s += 'vowel pattern: '+o.vp+lb;
			s += 'tone mark: '+o.tm+lb;
			s += 'final consonant: '+o.fc+lb;
			s += 'tone: '+o.tn+lb;
			s += 'rules: '+o.ru+lb;
			break;
		default:
			s += 'I can show errors, lines, words, or newvocab.<br/>';
	}
	return s;
}

voyc.Sam.prototype.drawLine = function(r,item) {
	var s = '';
	var x = item.th;
	var linenum = item.words[0].loc[0].line;
	s += '<line num='+linenum+' hint=0>';
	if (r.adj['hint']) {
		s += '<button type=button line="'+linenum+'"><span>H</span></button>';
	}
	s += '<thai>';
	if (item.speaker != 'th') {
		s += '<speaker>'+item.speaker + ':</speaker>';
	}
	for (var n=0; n<item.words.length; n++) {
		var word = item.words[n];
		if (n > 0) {
			s += '</word>';
		}
		var wid = [word.id,word.loc[0].line,word.loc[0].wndx].join('.');
		var mm = word.loc[0].n;
		s += voyc.printf('<word wid="$1" mm=$2',[wid,mm]);
		//s += '<word wid="'+wid+'"';
		if (!word.dict) {
			s += ' error';
		}
		else if (!word.vocab) {
			s += ' newvocab ';
		}
		else if (word.dict.mean.length > 1) {
			s += ' multimean ';
			if (word.loc[0].n) {
				s += ' chosen ';
			}
		}
		s += '>';
		s += '<t>'+word.t+'</t>';
		var locn = (word.loc[0].n) ? word.loc[0].n-1 : 0;
		var eng = (word.dict) ? word.dict.mean[locn].e : '';
		s += '<e>'+eng+'</e>';
		var tl = (word.dict) ? voyc.dictionary.drawTranslit(word.dict.tl) : '';
		s += '<tl>'+tl+'</tl>';
	} 
	s += '</word>';
	s += '</thai>';
	s += '<eng>';
	s += item.en;
	s += '</eng>';
	s += '</line>';
	return s;
}

voyc.Sam.prototype.composeWord = function(word,r,wid) {
	var s = '';
	s += '<p>'+word.dict.t;
	s += " <icon type='draw' name='speaker' text='"+word.dict.t+"'></icon> &nbsp;";
	s += voyc.dictionary.drawTranslit(word.dict.tl);
	s += "<icon type='char' name='pencil' did='"+word.dict.id+"'></icon>";
	s += '</p>';
	var numdefs = word.dict.mean.length;
	var mean = word.dict.mean[0];
	if (numdefs == 1) {
		s += '<p><b>'+mean.e+'</b> <i>'+voyc.pos[mean.p]+'</i> '+mean.d+'</p>';
	}
	else {
		for (var i=0; i<word.dict.mean.length; i++) {
			mean = word.dict.mean[i];
			var num = mean.n + '. ';
			var mm = mean.n;
			var eng = '';
			if (word.loc[0].n > 0 && word.loc[0].n == (i+1)) {
				eng = '<b>'+mean.e+'</b>';
			}
			else if (r.adj['author']) {
				eng = voyc.printf('<button type=button wid="$1" mm=$2 class=anchor>$3</button>',[wid,mm,mean.e]);
				//eng = '<button type=button mm='+mm+' class=anchor>'+mean.e+'</button>';
			}
			s += '<p>'+num+eng+' <i>'+voyc.pos[mean.p]+'</i> '+mean.d+'</p>';
		}
	}
	//type=o components and pronunciation rules
	//type=m components with click
	return s;
}

voyc.Sam.prototype.chooseMean = function(e,mm,wid) {
	var n = parseInt(mm);
	var a = wid.split('.');
	var did = parseInt(a[0]);
	var line= parseInt(a[1]);
	var wndx = parseInt(a[2]);

	// insert the chosen mean into the lines/words array
	var word = voyc.story.lines[line-1].words[wndx];
	word.loc[0].n = n;

	// insert the chosen mean into the story/words array
	

	// set the UI
	var parent = voyc.findParentWithTag(voyc.cheat,'story');
	var el = parent.querySelector('word[wid="'+wid+'"]');
	el.setAttribute('chosen',true);
}

voyc.Sam.prototype.cmdSearch = function(r) {
	if (this.state != 'ready') {
		this.dochat('busy already');
	}
	else if (!r.object) {
		this.dochat('search for what?');
	}
	else {
		if (r.adj['glyph']) {
			var o = voyc.alphabet.search(r.object);
			var s = 'not found';
			if (o) {
				s = voyc.alphabet.compose(o);
			}
			this.dochat(s);
		}
		else {
			this.state = 'search';
			var m = voyc.dictionary.search(r.object);
			this.dochat('searching...');
		}
	}
}

/* call the editor with state 'edit' or 'insert' */
voyc.Sam.prototype.cmdEdit = function(r) {
	if (this.state != 'ready') {
		this.dochat('busy already');
	}
	else if (!r.adj['new'] && !r.object) {
		this.dochat('edit what?');
	}
	else if (r.adj['new']) {
		this.state = 'insert';
		voyc.observer.publish('edit-requested', 'sam', {act:'i',t:r.object});
	}
	else {
		this.state = 'edit';
		var m = voyc.dictionary.search(r.object);
	}
}

voyc.Sam.prototype.onEditCancelled = function(note) {
	this.dochat('edit cancelled');
	this.state = 'ready';
	voyc.browserhistory.nav('home');
}

voyc.Sam.prototype.onSetDictReceived = function(note) {
	if (note.payload.status == 'ok') {
		this.dochat('edit saved');
	}
	else {
		this.dochat('edit save failed.');
	}
	this.state = 'ready';
	voyc.browserhistory.nav('home');
}

voyc.Sam.prototype.cmdSetVocab = function(req) {
	// set word type state
	function validateType(type) {
		return ('gomx'.indexOf(type) > -1);
	}
	function validateState(state) {
		return ('uwrm012345'.indexOf(state) > -1);
	}
	var word = req.object;
	var type = req.adj['type'];
	var state = req.adj['state'];
	if (type && !validateType(type)) return false;
	if (!validateState(state)) return false;
	voyc.vocab.set(word,type,state);
}

voyc.Sam.prototype.cmdGetVocab = function(req) {
	/** usage
		get ว่า -from=vocab
		get all -from=vocab
		get -state=m all -from=vocab
		get -type= all -from=vocab
		get all status
		get all all
	**/
//	if (!(req.adv['from'] == 'vocab')) {
//		return false;
//	}
	var r = [];
	var word = req.object;
	var state = req.adj['state'];
	var type = req.adj['type'];
	if (word == 'all') {
		state = (state == 'all') ? '' : state;
		type = (type == 'all') ? '' : type;
		var list = voyc.vocab.getlist(state, type);
		for (var i=0; i<list.length; i++) {
			e = list[i];
			var s = e.w + '\t' + e.t + '\t' + e.s;
			r.push(s);
		}
	}
	else {
		var e = voyc.vocab.get(word);
		if (e) {
			var s = word + '\t' + e.t + '\t' + e.s;
			r.push(s);
		}
	}
	return r;
}

voyc.Sam.prototype.cmdRemoveVocab = function(req) {
	var word = req.object;
	voyc.vocab.remove(word);
}

//------------------
// add to jslib/utils.js

voyc.printf = function(s,a) {
	var t = s;
	var m = t.match(/\$\d/g)
	for (var i=0; i<m.length; i++) {
		var u = m[i];
		var d = parseInt(u.substr(1));
		var r = a[d-1];
		t = t.replace(u, r);		
	}
	return t;
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

