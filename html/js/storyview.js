/**
	class StoryView\
	@constructor

	Display the story page.
**/

voyc.StoryView = function(container) {
	// is singleton
	if (voyc.StoryView._instance) return voyc.StoryView._instance;
	else voyc.StoryView._instance = this;

	this.container = container;
	this.observer = voyc.observer;
	
	this.numTrans = 1;
	this.maxTrans = 5;
	this.tview = 'n';
	this.setup();
}

voyc.StoryView.prototype.setup = function() {
	this.lang = 'thai';
	var self = this;
	this.observer.subscribe('storyview-requested', 'storyview', function(note) {self.onStoryViewRequested(note);});
	this.observer.subscribe('getstories-received', 'storyview', function(note) {self.onGetStoriesReceived(note);});
	this.observer.subscribe('story-ready', 'storyview', function(note) {self.onStoryReady(note);});
}

voyc.StoryView.prototype.onStoryViewRequested = function(note) {
	this.container.innerHTML = '<p>Loading...</p>';
	var a = note.payload.page.split('-');
	if (a.length > 1) {
		// open insert form
		if (a[1] == 'new') {
			this.openForm(0,'');
		}
		// if story requested by id, draw it
		else {
			voyc.story.read(a[1]);
		}
	}
	// otherwise, show the list
	else {
		voyc.story.list();
	}
}

voyc.StoryView.prototype.openForm = function(id, raw) {
	var s = '';
	var title = (id) ? voyc.story.title : 'New Story';	
	s += '<h2>'+title+'</h2>';
	s += '<div class=horz>';
	s += '<button id=storyparsebtn sid='+id+'>Parse</button>';
	s += '<button id=storycancelbtn>Cancel</button>';
	s += '</div>';
	s += '<p>';
	s += '<textarea id=storyraw>';
	if (raw) {
		s += raw;
	}
	s += '</textarea>';
	s += '</p>';
	this.container.innerHTML = s;

	// attach handlers
	var self = this;
	document.getElementById('storyparsebtn').addEventListener('click', function(e) {
		var raw = document.getElementById('storyraw').value;
		var sid = document.getElementById('storyparsebtn').getAttribute('sid');
		voyc.story.parse(sid, raw);
	}, false);
	document.getElementById('storycancelbtn').addEventListener('click', function(e) {
		self.onStoryReady();
	}, false);
}

voyc.StoryView.prototype.onGetStoriesReceived = function(note) {
	if (note.payload.status != 'ok') {
		return;
	}
	var s = '';
	s += '<p><button sid=new>New Story</button></p>';
	var list = note.payload.list;
	for (var i=0; i<list.length; i++) {
		s += '<p><button type="button" class="anchor" sid="'+list[i].id+'">';
		s += list[i].title;
		s += '</button></p>';
	}
	this.container.innerHTML = s;

	// attach handlers
	var self = this;
	var elist = document.getElementById('storyview').querySelectorAll('button[sid]');
	for (var i=0; i<elist.length; i++) {
		elist[i].addEventListener('click', function(e) {
			var sid = e.currentTarget.getAttribute('sid');
			voyc.browserhistory.nav('storyview-'+sid);
		}, false);
	}
}

voyc.StoryView.prototype.onStoryReady = function(note) {
	// draw the story
	this.container.innerHTML = voyc.story.draw();

	// remove whitespace from the html
	var elist = this.container.querySelectorAll('row');
	for (var i=0; i<elist.length; i++) {
		voyc.removeWhiteSpace(elist[i]);
	}
	var elist = this.container.querySelectorAll('box');
	for (var i=0; i<elist.length; i++) {
		voyc.removeWhiteSpace(elist[i]);
	}

	// attach button handlers
	var self = this;
	document.getElementById('thbtn').addEventListener('click',function(e) {self.setview('view','th')});
	document.getElementById('sbsbtn').addEventListener('click',function(e){self.setview('view','sbs')});
	document.getElementById('enbtn').addEventListener('click',function(e) {self.setview('view','en')});
	document.getElementById('nbtn').addEventListener('click',function(e)  {self.setview('tview','n')});
	document.getElementById('sbtn').addEventListener('click',function(e)  {self.setview('tview','s')});
	document.getElementById('bbtn').addEventListener('click',function(e)  {self.setview('tview','b')});

	document.getElementById('drillbtn').addEventListener('click',function(e)  {
		self.observer.publish('drill-requested', 'storyview', {story:voyc.story});
	}, false);
	document.getElementById('replacebtn').addEventListener('click',function(e)  {
		self.openForm(voyc.story.id, voyc.story.original);
	}, false);
	document.getElementById('editbtn').addEventListener('click',function(e)  {
		self.setmode('edit');
		self.setview('tview','e');
	}, false);
	document.getElementById('storysavebtn').addEventListener('click',function(e)  {
		voyc.story.save();
	}, false);
	document.getElementById('storyeditdonebtn').addEventListener('click',function(e)  {
		raw = self.reconstitute();
		voyc.story.parse(voyc.story.id, raw);
		self.setview('tview',self.tview);
		self.setmode('view');
	}, false);
	document.getElementById('storyeditcancelbtn').addEventListener('click',function(e)  {
		self.setview('tview',self.tview);
		self.setmode('view');
	}, false);

	// initialize view
	(new voyc.Minimal).attachAll(this.container);
	(new voyc.Icon).attachAll(this.container);
	(new voyc.Icon).drawAll(this.container);
	document.getElementById('sbsbtn').classList.add('down');
	document.querySelector('story').setAttribute('view', 'sbs');
	document.getElementById('nbtn').classList.add('down');
	document.querySelector('story').setAttribute('tview', 'n');

	// attach handler for each word
	
	var list = this.container.querySelectorAll('story word');
	for (var i=0; i<list.length; i++) {
		list[i].addEventListener('click', function(clk) {
			console.log('word clicked');
			var wrd = clk.currentTarget;
			var wid = wrd.getAttribute('wid');
			var w = wid.split('.');
			var did =  parseInt(w[0]);
			var line=  parseInt(w[1]);
			var wndx = parseInt(w[2]);
			var word = voyc.story.lines[line-1].words[wndx];
			var s = self.composeWord(word,{adj:['author']},wid);
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




}
voyc.StoryView.prototype.setview = function(attr,value) {
	document.querySelector('story').setAttribute(attr, value);
	if (attr == 'tview' && value != 'e') {
		this.tview = value;
	}
}
voyc.StoryView.prototype.setmode = function(value) {
	document.querySelector('section#storyview').setAttribute('mode', value);
}

voyc.StoryView.prototype.composeWord = function(word,r,wid) {
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

voyc.StoryView.prototype.chooseMean = function(e,mm,wid) {
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

voyc.StoryView.prototype.reconstitute = function() {
	var s = voyc.story.original;
	var a = voyc.story.original.split('\n');
	var raw = '';
	var nline = 0;
	for (var i=0; i<a.length; i++) {
		var sline = a[i];
		if (sline.trim().length <= 1) { // ignore empty lines
			raw += sline;
		}
		else if (sline.indexOf('::') > -1) { // ignore speaker and comment lines
			raw += sline;
		}
		else {
			var th = this.container.querySelector('line[num="'+nline+'"] thai orig textarea').value;
			var en = this.container.querySelector('line[num="'+nline+'"] eng orig textarea').value;
			raw += th + ' ~ ' + en + '\n';
			nline++;
		}
	}

	console.log('reconstitute ' + ((voyc.story.original == raw) ? 'same' : 'different'));
	return raw;
}
