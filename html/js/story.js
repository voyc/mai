/**
	class Story
	Represent one story.
**/
voyc.Story = function() {
	this.id = 0;
	this.authorid = 0;
	this.original = '';
	this.title = '';
	this.language = 'th';
	this.speakers = { x: {name: "narrator", age: 40, gender: "male"} };
	this.lines = [];
	this.words = [];
	this.meta = '';

	var self = this;
	voyc.observer.subscribe('getstory-received' ,'story' ,function(note) { self.onGetStoryReceived (note);});
	voyc.observer.subscribe('getdict-received'  ,'story' ,function(note) { self.onGetDictReceived (note);});
	voyc.observer.subscribe('getcomps-received' ,'story' ,function(note) { self.onGetCompsReceived (note);});
}

voyc.Story.prototype.list = function() {
	var svcname = 'getstories';
	var data = {};
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		voyc.observer.publish(svcname+'-received', 'story', response);
	});
	voyc.observer.publish(svcname+'-posted', 'story', {});
}

voyc.Story.prototype.getComps = function() {
	var svcname = 'getcomps';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['id'] = this.id;
	data['words'] = JSON.stringify( this.condenseWords(this.words));
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		voyc.observer.publish(svcname+'-received', 'story', response);
	});
	voyc.observer.publish(svcname+'-posted', 'story', {});
}

voyc.Story.prototype.doComps = function() {
	this.id = parseInt(id);
	var svcname = 'dostorycomps';
	var data = {};
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		voyc.observer.publish(svcname+'-received', 'story', response);
	});
	voyc.observer.publish(svcname+'-posted', 'story', {});
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
	data['words'] = JSON.stringify( this.condenseWords(this.consolidateWords()));
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}
		voyc.observer.publish('setstory-received', 'story', response);
		if (response['status'] == 'ok') {
			console.log('setstory success');
		}
		else {
			console.log('setstory failed');
		}
	});
	voyc.observer.publish('setstory-posted', 'story', {});
}

// initialize one new story
voyc.Story.prototype.parse = function(sid, raw) {
	if (!parseInt(sid)) {
		this.id       = 0;
		this.authorid = 0;
		this.language = 'th';
		this.title    = '';
	}
	if (raw) {
		this.original = raw;
		this.words = [];
	}
	this.speakers = { x: {name: "narrator", age: 40, gender: "male"} };
	this.lines = [];
	this.meta = [];

	voyc.noam.parseStory(this);
	this.words = this.consolidateWords();
	this.getComps(this.words);
}
voyc.Story.prototype.onGetCompsReceived = function(note) {
	this.words = note.payload.words;
	var ids = this.gatherIds();
	voyc.dictionary.getDict(ids);
}

voyc.Story.prototype.gatherIds = function() {
	var ids = [];
	for (var i=0; i<this.words.length; i++) {
		var id = this.words[i].id;
		if (id) {
			ids.push(id);
		}
	}
	return ids;
}

// read a story from the db
voyc.Story.prototype.read = function(id) {
	this.id = parseInt(id);
	var svcname = 'getstory';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['id'] = this.id;
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) { response = { 'status':'system-error'}; }
		console.log(svcname + ' status ' + response['status']);
		if (response.status == 'ok') {
		}
		voyc.observer.publish(svcname+'-received', 'story', response);
	});
	voyc.observer.publish(svcname+'-posted', 'story', {});
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

	this.parse(this.id);
}

voyc.Story.prototype.onGetDictReceived = function(note) {
	// add dict info to lines and words
	for (var i=0; i<this.words.length; i++) {
		var item = this.words[i];
		item.dict = voyc.dictionary.miniDict(item.id);
		item.vocab = voyc.vocab.get(item.t);
	}
	for (var i=0; i<this.lines.length; i++) {
		var line = this.lines[i];
		for (var j=0; j<line.words.length; j++) {
			var word = line.words[j];
			word.dict = voyc.dictionary.miniDict(word.id);
			item.vocab = voyc.vocab.get(item.t);
		}
	}
	this.setDefaultEnglishLines();
	voyc.observer.publish('story-ready', 'story', {id:this.id,title:this.title});
}

voyc.Story.prototype.setDefaultEnglishLines = function() {
	for (var i=0; i<this.lines.length; i++) {
		var line = this.lines[i];
		if (!line.en) {
			var s = '';	
			for (var j=0; j<line.words.length; j++) {
				var word = line.words[j];
				if (word.dict) {
					s += (s.length) ? ' ' : '';
					s += word.dict.mean[word.loc[0].n].e;
				}
				else {
					s += (s.length) ? ' ' : '';
					s += word.t;
				}
			}
			line.en = s;
		}
	}
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
			var wid = [word.id,word.loc[0].line,word.loc[0].wndx].join('.');
			var mm = word.loc[0].n;
			var mmn = (mm>0) ? mm-1 : mm;
			var e = (word.dict) ? word.dict.mean[mmn].e : '.';
			var tl = (word.dict) ? voyc.dictionary.drawTranslit(word.dict.tl) : '.';
			var attr = '';
			if (!word.dict) attr = 'error';
			else if (mm > 0) attr = 'chosen';
			else if (word.dict && word.dict.mean.length>1) attr = 'multimean';
			else if (!word.vocab || !(word.vocab.s == 'm')) attr = 'newvocab';
			srow += voyc.printf(voyc.Story.template.wordrow, [wid,mm,word.t,attr]);
			sbox += voyc.printf(voyc.Story.template.wordbox, [wid,mm,word.t,e,tl,attr]);
		}
		sline += voyc.printf(voyc.Story.template.line, [linenum, line.th, srow, sbox, line.en]);
	}
	var s = voyc.printf(voyc.Story.template.story, [this.title,sline]);
	return s;
}

voyc.Story.template = {};

voyc.Story.template.story = `
<h2>$1</h2>
<div id=storyviewbtnrow class=horz><table id=buttonrow><tr><td>
<thaibtns>
<button id=nbtn toggle=tview>&#x2501;</button>
<button id=sbtn toggle=tview>&#x2505;</button>
<button id=bbtn toggle=tview>&#x25a1;</button>
</thaibtns>
</td>
<td>
<button id=drillbtn  >Drill</button>
<button id=editbtn   >Edit</button>
<button id=replacebtn>Replace</button>
<button id=storysavebtn>Save</button>
</td><td>
<button id=thbtn  toggle=view>th</button>
<button id=sbsbtn toggle=view class=down>t|e</button>
<button id=enbtn  toggle=view>en</button>
</td></tr></table></div>

<div id=storyeditbtnrow class=horz>
<editbtns>
<button id=storyeditdonebtn>&#10003;Done</button>
<button id=storyeditcancelbtn>Cancel</button>
</editbtns>
</div>

<p>
<story class=horz>
$2
</story>
</p>
`;

voyc.Story.template.line = `
<line num="$1">
<thai>
<orig><textarea>$2</textarea></orig>
<row>$3
</row>
<box>$4</box>
</thai>
<eng>
<orig><textarea>$5</textarea></orig>
<e>$5</e>
</eng>
</line>
`;

voyc.Story.template.wordrow = `
<word wid="$1" mm="$2" $4><t>$3</t></word>
`;

voyc.Story.template.wordbox = `
<word wid="$1" mm="$2" $6><t>$3</t><e>$4</e><tl>$5</tl></word>
`;
