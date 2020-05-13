/**
	class StoryView\
	@constructor

	Display the story page.
**/

voyc.StoryView = function(container, noam) {
	// is singleton
	if (voyc.StoryView._instance) return voyc.StoryView._instance;
	else voyc.StoryView._instance = this;

	this.container = container;
	this.noam = noam;
	this.observer = voyc.observer;
	this.comm = voyc.comm;
	
	this.numTrans = 1;
	this.maxTrans = 5;
	this.setup();

	this.story = new voyc.Story(this.noam);
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
			this.openForm();
		}
		// if story requested by id, draw it
		else {
			this.story.read(a[1]);
		}
	}
	// otherwise, show the list
	else {
		this.list();
	}
}

voyc.StoryView.prototype.openForm = function(raw) {
	var s = '<p>';
	s += '<textarea id=storyraw>';
	if (raw) {
		s += raw;
	}
	s += '</textarea>';
	s += '<button id=storyparsebtn>Parse</button>';
	s += '<button>Cancel</button>';
	s += '<button>Save</button>';	
	s += '</p>';
	this.container.innerHTML = s;

	// attach handlers
	var self = this;
	document.getElementById('storyparsebtn').addEventListener('click', function(e) {
		var raw = document.getElementById('storyraw').value;
		self.story.parse(raw);
	}, false);
}

voyc.StoryView.prototype.list = function() {
       this.id = parseInt(id);
       var svcname = 'getstories';
       var data = {};
       var self = this;
       this.comm.request(svcname, data, function(ok, response, xhr) {
               if (!ok) { response = { 'status':'system-error'}; }
               console.log(svcname + ' status ' + response['status']);
               self.observer.publish(svcname+'-received', 'storyview', response);
       });
       this.observer.publish(svcname+'-posted', 'storyview', {});
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
			(new voyc.BrowserHistory).nav('storyview-'+sid);
		}, false);
	}
}

voyc.StoryView.prototype.onStoryReady = function(note) {
	// draw the story
	this.container.innerHTML = this.story.draw();

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
		self.observer.publish('drill-requested', 'storyview', {story:self.story});
	}, false);
	document.getElementById('replacebtn').addEventListener('click',function(e)  {
		var raw = self.story.original;
		self.openForm(raw);
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
			var word = self.story.lines[line-1].words[wndx];
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
	var word = this.story.lines[line-1].words[wndx];
	word.loc[0].n = n;

	// insert the chosen mean into the story/words array
	

	// set the UI
	var parent = voyc.findParentWithTag(voyc.cheat,'story');
	var el = parent.querySelector('word[wid="'+wid+'"]');
	el.setAttribute('chosen',true);
}

