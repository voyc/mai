/**
	class Story
	Represent one story.
**/
voyc.Story = function(noam) {
	this.noam = noam;

	this.id = 0;
	this.authorid = 0;
	this.original = '';
	this.title = '';
	this.language = 'th';
	this.speakers = { x: {name: "narrator", age: 40, gender: "male"} };
	this.lines = [];
	this.words = [];
	this.meta = '';

	var url = '/svc/';
	if (window.location.origin == 'file://') {
		url = 'http://mai.voyc.com/svc';  // for local testing
	}
	this.comm = new voyc.Comm(url, 'acomm', 2, true);
	this.observer = new voyc.Observer();
	var self = this;
	this.observer.subscribe('getstory-received' ,'story' ,function(note) { self.onGetStoryReceived (note);});
	this.observer.subscribe('getdict-received' ,'story' ,function(note) { self.onGetDictReceived (note);});
}

voyc.Story.prototype.replace = function(newtext) {
	this.original = newtext;
	this.title = '';
	this.speakers = { x: {name: "narrator", age: 40, gender: "male"} };
	this.lines = [];
	this.words = [];
}

voyc.Story.prototype.consolidateWords = function() {
	var a = [];
	for (var i=0; i<this.lines.length; i++) {
		a = this.combineArrays(a, this.lines[i].words);
	}
	return a;
}
voyc.Story.prototype.combineArrays = function(combined, a) {
	var c = combined;
	var matched = false;
	for (var i=0; i<a.length; i++) { // a[i] incoming
		matched = false;
		for (var j=0; j<c.length; j++) { // c[j] master
			if (c[j].t == a[i].t) {
				c[j].loc.push(voyc.clone(a[i].loc[0]));
				matched = true;
				break;
			}
		}
		if (!matched) {
			var b = voyc.clone(a[i]);
			c.push(b);
		}
	}
	return c;
}

// build array of one-syllable components from words
voyc.Story.prototype.consolidateComponents = function() {
	var cpa = voyc.cloneArray(this.words);
	var bfinished = this.explodeComponents(cpa);	
	var runaway = 10;
	while ((runaway > 0) && !bfinished) {
		runaway--;
		bfinished = this.explodeComponents(cpa);	
	}
	
	// now cpa includes a combination of word objects and fastmatch objects

	// make list of ids
	// call server getDict
	// onGetDictReceived, add dict to this.components

	return cpa; // to this.components
}

voyc.Story.prototype.explodeComponents = function(cpa) {
	var bfinished = true;
	var c = [];
	for (var i=0; i<cpa.length; i++) {
		var word = cpa[i];
		if (word.g == 'm') {
			bfinished = false;
			for (var j=0; j<word.cp.length; j++) {
				var cp = word.cp[j];
				m = voyc.dictionary.fastMatch(cp);
				if (m && !cpa.includes(m)) {
					cpa.push(m);
				}
			}
			delete cpa[i];
			i--;
		}
	}
	return bfinished;
}

voyc.Story.prototype.condenseWords = function(words) {
	var a = [];
	for (var i=0; i<words.length; i++) {
		var word = voyc.clone(words[i]);
		delete word.dict;
		delete word.vocab;
		a.push(word);
	}
	return a;
}

voyc.Story.prototype.save = function() {
	var svcname = 'setstory';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['id'] = this.id;
	data['language' ] = this.language;
	data['title' ] = this.title;
	data['original'] = this.original;
	data['words'] = JSON.stringify( this.condenseWords(this.consolidateWords(this.words)));
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}
		self.observer.publish('setstory-received', 'story', response);
		if (response['status'] == 'ok') {
			console.log('setstory success');
		}
		else {
			console.log('setstory failed');
		}
	});
	this.observer.publish('setstory-posted', 'story', {});
}

voyc.Story.prototype.read = function(id) {
	this.id = parseInt(id);
	var svcname = 'getstory';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['id'] = this.id;
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		if (response.status == 'ok') {
		}
		self.observer.publish(svcname+'-received', 'story', response);
	});
	this.observer.publish(svcname+'-posted', 'story', {});
}

voyc.Story.prototype.onGetStoryReceived = function(note) {
	if (note.payload.status != 'ok') {
		return;
	}
	var story = note.payload.story;
	this.id       = parseInt(story.id);
	this.authorid = parseInt(story.authorid);
	this.language = story.language;
	this.title    = story.title;
	this.original = story.original;
	this.words = (story.words) ? JSON.parse(story.words) : [];
	this.speakers = { x: {name: "narrator", age: 40, gender: "male"} };
	this.lines = [];
	this.meta = [];

	this.noam.parseStory(this);

	// get a miniDict for all the words in the story
	var ids = [];
	for (var i=0; i<this.words.length; i++) {
		var id = this.words[i].id;
		if (id) {
			ids.push(id);
		}
	}
	voyc.dictionary.getDict(ids);
}

voyc.Story.prototype.onGetDictReceived = function(note) {
	// add dict info to lines and words
	for (var i=0; i<this.words.length; i++) {
		var item = this.words[i];
		item.dict = voyc.dictionary.miniDict(item.id);
	}
	for (var i=0; i<this.lines.length; i++) {
		var line = this.lines[i];
		for (var j=0; j<line.words.length; j++) {
			var word = line.words[j];
			word.dict = voyc.dictionary.miniDict(word.id);
		}
	}
	this.observer.publish('story-ready', 'story', {id:this.id,title:this.title});
}

voyc.Story.prototype.draw = function() {
	var sline = '';
	for (var i=0; i<this.lines.length; i++) {
		var line = this.lines[i];
		var linenum = i;
		var srow = '';
		var sbox = '';
		for (var j=0; j<line.words.length; j++) {
			var word = line.words[j];
			var wid = '0.0.0';
			var mm = word.loc[0].n;
			var e = (word.dict) ? word.dict.mean[mm].e : '';
			var tl = (word.dict) ? word.dict.tl : '';
			srow += voyc.printf(voyc.Story.template.wordrow, [wid,mm,word.t]);
			sbox += voyc.printf(voyc.Story.template.wordbox, [wid,mm,word.t,word.e,word.tl]);
		}
		sline += voyc.printf(voyc.Story.template.line, [linenum, line.th, srow, sbox, line.en]);
	}
	var s = voyc.printf(voyc.Story.template.story, [this.title,sline]);
	return s;
}

voyc.Story.template = {};

voyc.Story.template.story = `
<p>$1</p>
<table id=buttonrow><tr><td>
<button>Drill</button>
<button>Analyze</button>
<button>Parse</button>
<button>Edit</button>
<button>Save</button>
<button>Cancel</button>
</td><td>
<button id=thbtn  toggle=view>th</button>
<button id=sbsbtn toggle=view class=down>t|e</button>
<button id=enbtn  toggle=view>en</button>
</td></tr></table>
<story>
<thaibtns>
<button id=nbtn toggle=tview>.</button>
<button id=sbtn toggle=tview>-</button>
<button id=bbtn toggle=tview>|</button>
</thaibtns>
$2
</story>
`;

voyc.Story.template.line = `
<line num="$1">
<thai>
<orig>$2</orig>
<row>$3</row>
<box>$4</box>
</thai>
<eng>$5</eng>
</line>
`;

voyc.Story.template.wordrow = `
<word wid="$1" mm="$2"><t>$3</t></word>
`;

voyc.Story.template.wordbox = `
<word wid="$1" mm="$2"><t>$3</t><e>$4</e><tl>$5</tl></word>
`;
