/**
	class Editor\
	@constructor

	Display the dictionary editor form.
**/

voyc.Editor = function(container) {
	// is singleton
	if (voyc.Editor._instance) return voyc.Editor._instance;
	else voyc.Editor._instance = this;

	this.container = container;
	this.numTrans = 1;
	this.maxTrans = 5;
	this.setup();
}

voyc.Editor.prototype.setup = function() {
	this.lang = 'thai';
	var self = this;
	voyc.observer.subscribe('edit-requested', 'editor', function(note) {self.onEditRequested(note.payload);});
	voyc.observer.subscribe('acceptparse-submitted', 'editor', function(note) {self.onAcceptParse(note.payload);});

	this.container.innerHTML = voyc.Editor.template.page;

	var translate = this.container.querySelector('#translate');
	for (var i=0; i<this.maxTrans; i++) {
		var d = document.createElement('div');
		d.id = 'trans'+i;
		d.setAttribute('name', 'trans');
		var s = voyc.Editor.template.trans.replace(/%n1/g,i+1);
		s = s.replace(/%n/g,i);
		d.innerHTML = s;
		translate.appendChild(d);
	}

	(new voyc.Minimal).attachAll(this.container);

	this.container.querySelector('#translit').readOnly = true;
	this.container.querySelector('#components').readOnly = true;

	this.container.querySelector('#tlm').addEventListener('click', function(e) {
		var tl = self.container.querySelector('#translit');
		tl.readOnly = !e.currentTarget.checked;
		tl.focus();
	},false);
	
	this.container.querySelector('#tlbtn').addEventListener('click', function(e) {
		//dictionary parse
		//display results in popup, with accept or reject
		//first time, on edit -new, parse and accept automatically
		//set g = o or m
		//set components
		//set translit
		var s = self.container.querySelector('#thai').value;
		self.parse(s);
	},false);
	
	this.container.querySelector('#cpm').addEventListener('click', function(e) {
		var cp = self.container.querySelector('#components');
		cp.readOnly = !e.currentTarget.checked;
		cp.focus();
	},false);
	
	var list = this.container.querySelectorAll('[name=trans]');	
	for (var i=0; i<list.length; i++) {
		list[i].querySelector('[name=pos]').addEventListener('focus', function(e) {
			self.posopen(e.currentTarget);
		},false);
		list[i].querySelector('[name=posselect]').addEventListener('blur', function(e) {
			self.posclose(e.currentTarget);
		},false);
	}

	voyc.$('cancelbtn').addEventListener('click', function(e) {
		self.clear();
		voyc.observer.publish('edit-cancelled', 'editor', {});
		window.history.back();
	},false);
	voyc.$('savebtn').addEventListener('click', function(e) {
		self.save();
		window.history.back();
	},false);
	voyc.$('addtransbtn').addEventListener('click', function(e) {
		var t = self.container.querySelector('#translate');
		var tel = t.querySelector('#trans'+self.numTrans);
		tel.classList.remove('hidden');
		var pos = t.querySelector('#pos'+self.numTrans);
		self.numTrans++;
		pos.setAttribute('trx','i');
		pos.setAttribute('mid',0);
		pos.setAttribute('numdef',self.numTrans);
	},false);
}

voyc.Editor.prototype.save = function() {
	var r = {};
	d = this.container.querySelector('#thai');
	r.t = d.value;
	r.trx = d.getAttribute('trx');
	r.id = d.getAttribute('did');
	r.tlm = (this.container.querySelector('#tlm').checked) ? 'm' : 'a';
	r.tl = this.container.querySelector('#translit').value;
	r.cpm = (this.container.querySelector('#cpm').checked) ? 'm' : 'a';
	r.cp = this.container.querySelector('#components').value;
	r.g = this.container.querySelector('#g').value;
	r.ru = this.container.querySelector('#rules').value;

	r.mean = [];
	for (var i=0; i<this.numTrans; i++) {
		var m = {};
		var p = this.container.querySelector('#pos'+i);
		m.trx = p.getAttribute('trx');
		m.mid = p.getAttribute('mid');
		m.n = p.getAttribute('numdef');
		//m.s = p.getAttribute('s');
		//m.l = p.getAttribute('l');
		m.p = p.getAttribute('data');
		m.e = this.container.querySelector('#eng'+i).value;
		m.d = this.container.querySelector('#details'+i).value;
		r.mean.push(m);
	}
	voyc.dictionary.update(r);
}

voyc.Editor.prototype.clear = function() {
	var d = this.container.querySelector('#thai');
	d.value = '';
	d.setAttribute('trx','i');
	d.setAttribute('did',0);
	this.container.querySelector('#internals').innerHTML = '  '; 
	this.container.querySelector('#translit').value = '';
	this.container.querySelector('#translit').readOnly = true;
	this.container.querySelector('#tlm').checked = false;
	this.container.querySelector('#components').value = '';
	this.container.querySelector('#components').readOnly = true;
	this.container.querySelector('#cpm').checked = false;
	this.container.querySelector('#g').value = '';
	this.container.querySelector('#rules').value = '';

	var t = this.container.querySelector('#translate');
	var i=0;
	var pos = t.querySelector('#pos'+i);
	pos.setAttribute('data', '');
	pos.value = this.posdisplay('');
	pos.setAttribute('trx','i');
	pos.setAttribute('mid',0);
	pos.setAttribute('numdef',1);
	pos.setAttribute('s',1);
	pos.setAttribute('l',100);
	t.querySelector('#eng'+i).value = '';
	t.querySelector('#details'+i).value = '';
	t.querySelector('#trans'+i).classList.remove('hidden');

	this.numTrans = 1;
	for (var i=this.numTrans; i<this.maxTrans; i++) {
		t.querySelector('#trans'+i).classList.add('hidden');
	}
}

voyc.Editor.prototype.onEditRequested = function(m) {
	if (m.act == 'i') {
		this.clear();
		this.container.querySelector('#thai').value = m.t;
		this.parse(m.t);
	}
	else if (m.act == 'u') {
		this.populate(m.dict);
	}
	voyc.hist.nav({page:'editor'});
	this.container.querySelector('#thai').focus();
}

voyc.Editor.prototype.populate = function(dict) {
	var trx = 'u';
	var d = this.container.querySelector('#thai');
	d.value = dict.t;
	d.setAttribute('trx',trx);
	d.setAttribute('did',dict.id);
	this.container.querySelector('#internals').innerHTML = [dict.id,dict.g].join();
	this.container.querySelector('#translit').value = dict.tl;
	this.container.querySelector('#translit').readOnly = !(dict.tlm == 'm');
	this.container.querySelector('#tlm').checked = (dict.tlm == 'm');
	this.container.querySelector('#components').value = dict.cp;
	this.container.querySelector('#components').readOnly = !(dict.cpm == 'm');
	this.container.querySelector('#cpm').checked = (dict.cpm == 'm');
	this.container.querySelector('#g').value = dict.g;
	this.container.querySelector('#rules').value = dict.ru;

	var t = this.container.querySelector('#translate');
	this.numTrans = dict.mean.length;
	for (var i=0; i<this.numTrans; i++) {
		var mean = dict.mean[i];
		var pos = t.querySelector('#pos'+i);
		pos.setAttribute('trx', trx);  // must be changed when new meanings added
		pos.setAttribute('mid', mean.mid);
		pos.setAttribute('numdef', mean.n);
		pos.setAttribute('s',dict.s);
		pos.setAttribute('l',dict.l);
		pos.setAttribute('data', mean.p);
		pos.value = this.posdisplay(mean.p);
		t.querySelector('#eng'+i).value = mean.e;
		t.querySelector('#details'+i).value = mean.d;
		t.querySelector('#trans'+i).classList.remove('hidden');
	}
	for (var i=this.numTrans; i<this.maxTrans; i++) {
		t.querySelector('#trans'+i).classList.add('hidden');
	}
	voyc.hist.nav({page:'editor'});
	d.focus();
}

voyc.Editor.prototype.parse = function(s) {
	var ps = voyc.noam.parseString(s,1);  // returns array of objects
	if (ps && ps.length > 1) {
		var cpa = [];
		var tla = [];
		for (var i=0; i<ps.length; i++) {
			cpa.push(ps[i].t);
			tla.push(ps[i].tl);
		}
		document.getElementById('ptranslit').value = tla.join(' ');
		document.getElementById('pcomponents').value = cpa.join(',');
		document.getElementById('pg').value = 'm';
		document.getElementById('prules').value = '';
		(new voyc.Minimal).openPopup('acceptparse');
		voyc.fixOpen('acceptparse'); // really only need to do this once, but must wait til it's open
	}
	else {
		var pw = voyc.noam.parseSyllable(s); // returns object
		document.getElementById('ptranslit').value = pw.tl;
		document.getElementById('pcomponents').value = voyc.dictionary.joinComponents(pw);
		document.getElementById('pg').value = 'o';
		document.getElementById('prules').value = pw.ru;
		(new voyc.Minimal).openPopup('acceptparse');
		voyc.fixOpen('acceptparse'); // really only need to do this once, but must wait til it's open
	}
}

voyc.Editor.prototype.onAcceptParse = function(data) {
	voyc.$('translit').value = voyc.$('ptranslit').value;
	voyc.$('tlm').checked = false;
	voyc.$('components').value = voyc.$('pcomponents').value;
	voyc.$('cpm').checked = false;
	voyc.$('g').value = voyc.$('pg').value;
	voyc.$('rules').value = voyc.$('prules').value;
	(new voyc.Minimal).closePopup('acceptparse');
}

voyc.Editor.prototype.posdisplay = function(data) {
	var s = '';
	var a = data.split(''); // input data='nja' 
	for (var i=0; i<a.length; i++) {
		if (s) s += ',';
		s += voyc.pos[a[i]];
	}
	return s; // output display='noun,adj,article'
}

voyc.findParentWithTag = function(elem, tag, impatient) {
	var parent = null;
	for ( var e=elem; e && e !== document; e = e.parentNode ) {
		if (e.tagName.toLowerCase() == tag.toLowerCase()) {
			parent = e;
			if (impatient) {
				break;
			}
		}
	}
	return parent;
}

voyc.Editor.prototype.posopen = function(e) {
	var p = voyc.findParentWithTag(e, 'div', true);
	var pos = p.querySelector('[name=pos]');
	var possel = p.querySelector('[name=posselect]');
	var data = pos.getAttribute('data');
	var nodes = possel.querySelectorAll('option');
	for (var i=0; i<nodes.length; i++) {
		var b = (data.includes(nodes[i].value));
		nodes[i].selected = b;
	}
	pos.classList.add('hidden');
	possel.classList.remove('hidden');
	possel.focus();
}

voyc.Editor.prototype.posclose = function(e) {
	var p = voyc.findParentWithTag(e, 'div', true);
	var pos = p.querySelector('[name=pos]');
	var possel = p.querySelector('[name=posselect]');
	var data = '';
	var nodes = possel.querySelectorAll('option');
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].selected) {
			data += nodes[i].value;
		}
	}
	pos.setAttribute('data', data);
	pos.value = this.posdisplay(data);
	pos.classList.remove('hidden');
	possel.classList.add('hidden');
}

voyc.Editor.template = {};
voyc.Editor.template.page = `
<div id='dpage'>
<table class='dedit'>
	<tr><td>
		<label for='thai'>Thai word</label>
	</td><td>
		<input id='thai' type='text' />
		(<span id='internals'>328,2,300</span>)
	</td></tr><tr><td>
		<label for='translit'>Transliteration</label>
	</td><td>
		<input id='translit' type='text'/>
		<label for='tlm'><input type='checkbox' id='tlm' /> Manual</label>
		<button id='tlbtn'>Parse</button>
	</td></tr><tr><td>
		<label for='components'>Components</label>
	</td><td>
		<input id='components' type='text'/>
		<label for='cpm'><input type='checkbox' id='cpm' /> Manual</label>
	</td></tr><tr><td>
		<label for='g'>Type</label>
	</td><td>
		<input id='g' type='text'/>
	</td></tr><tr><td>
		<label for='rules'>Rules</label>
	</td><td>
		<input id='rules' type='text'/>
	</td></tr>
</table>
<div id='translate'></div>
<div>
	<button id='addtransbtn'>+ Add Translation</button>
</div>
<div id='dbuttons'>
	<button id='savebtn'>Save</button>
	<button id='cancelbtn'>Cancel</button>	
</div>
</div>
`;

voyc.Editor.template.trans = `
<fieldset><legend>Translation %n1</legend>
<table class='dedit'>	
	<tr><td>	
		<label for='pos%n'>Parts of Speech</label>
	</td><td>
		<input id='pos%n' name='pos' type='text' data='nja'/>
		<select id='posselect%n' name='posselect' multiple class='hidden' size='11'>
			<option value='n'>noun</option>
			<option value='v'>verb</option>
			<option value='c'>conjunction</option>
			<option value='p'>preposition</option>
			<option value='j'>adjective</option>
			<option value='e'>adverb</option>
			<option value='r'>pronoun</option>
			<option value='a'>particle</option>
			<option value='i'>interjection</option>
			<option value='s'>syllable</option>
		</select>
	</td></tr><tr><td>
		<label for='eng'>Gloss</label>
	</td><td>
		<input id='eng%n' name='eng' type='text' />
	</td></tr><tr><td>
		<label for='details'>Details</label
	</td><td>
		<input id='details%n' name='details' type='text' />
	</td></tr>
</table>
</fieldset>	
`;

// add this to Minimal on open dialog
voyc.fixOpen = function(eid) {
	// width must be odd, else left borders of input fields disappear
	// height must be even, else top borders disappear
	// I think it's a Chrome bug
	function isOdd(num) { return num % 2;}
	var pdialog = document.getElementById(eid);
	var w =  pdialog.offsetWidth;
	if (isOdd(w)) {
		pdialog.style.width = (w+1) + 'px';
	}
	var h =  pdialog.offsetHeight;
	if (!isOdd(h)) {
		pdialog.style.height = (h+1) + 'px';
	}
}

voyc.Editor.prototype.popupDict = function(id,mode,wid,chosen) {
	// input is dict id, assumed to be in minidict
	// moved from storyview::onStoryReady
	console.log("popupdict " + id);
	var dict = voyc.dictionary.miniDict(id);
	var s = voyc.dictionary.drawDetail(dict,mode,wid,chosen);

	var el = document.querySelector('form#worddetails div#details');
	el.innerHTML = s;
	//voyc.cheat = wrd;
	(new voyc.Minimal()).openPopup('worddetails');
	(new voyc.Minimal()).attachAll(el);
	(new voyc.Icon()).attachAll(el);
	(new voyc.Icon()).drawAll(el);

	//attach handler to speaker icons
	var elist = el.querySelectorAll('icon[name="speaker"]');
	for (var i=0; i<elist.length; i++) {
		elist[i].addEventListener('click', function(e) {
			var s = e.currentTarget.getAttribute('text');
			var l = voyc.dictionary.lang(s);
			voyc.speech.speak( s,l);
			console.log('speaking: '+s);
		}, false);
	}

	//attach handler to pencil icons
	var elist = el.querySelectorAll('icon[name="pencil"]');
	for (var i=0; i<elist.length; i++) {
		elist[i].addEventListener('click', function(e) {
			var id = e.currentTarget.getAttribute('did');
			voyc.observer.publish('edit-requested', 'editor', {act:'u',dict:dict});
			(new voyc.Minimal()).closePopup();
		}, false);
	}

	// attach handlers on choose meaning
	// applies only when called from story mode in author mode
	var self = this;
	var opts = el.querySelectorAll('button[mm]');
	for (var i=0; i<opts.length; i++) {
		opts[i].addEventListener('click',function(e) {
			var wid= e.currentTarget.getAttribute('wid');
			var mm = e.currentTarget.getAttribute('mm');
			self.chooseMean(e,mm,wid);  // probably move this to story
			(new voyc.Minimal).closePopup();
		}, false);
	}
}

voyc.Editor.prototype.chooseMean = function(e,mm,wid) {
	var n = parseInt(mm);
	var a = wid.split('.');
	var did = parseInt(a[0]);
	var line= parseInt(a[1]);
	var wndx = parseInt(a[2]);

	// insert the chosen mean into the lines/words array
	var word = voyc.story.lines[line-1].words[wndx];
	word.loc[0].n = n;

	// re-consolidate the words array to pickup the change in loc.n
	voyc.story.words = voyc.story.consolidateWords();

	// set the UI
	var elist = document.querySelectorAll('story word[wid="'+wid+'"]');
	for (var i=0; i<elist.length; i++) {
		elist[i].setAttribute('chosen',true);
	}
}
