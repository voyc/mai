/**
	class Editor\
	@constructor

	Display the dictionary editor form.
**/

voyc.Editor = function(container, observer, noam) {
	// is singleton
	if (voyc.Editor._instance) return voyc.Editor._instance;
	else voyc.Editor._instance = this;

	this.container = container;
	this.observer = observer;
	this.noam = noam;
	this.dictionary = voyc.dictionary;
	
	this.numTrans = 1;
	this.maxTrans = 5;
	this.setup();
}

voyc.Editor.prototype.setup = function() {
	this.lang = 'thai';
	var self = this;
	this.observer.subscribe('edit-requested', 'editor', function(note) {self.onEditRequested(note.payload);});

	this.container.innerHTML = voyc.Editor.template.page;

	var translate = this.container.querySelector('#translate');
	for (var i=0; i<this.maxTrans; i++) {
		var d = document.createElement('div');
		d.id = 'trans'+i;
		d.setAttribute('name', 'trans');
		var s = voyc.Editor.template.trans.replace(/%n/g,i);
		d.innerHTML = s.replace(/%n1/g,i+1);
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
		self.observer.publish('edit-cancelled', 'editor', {});
	},false);
	voyc.$('savebtn').addEventListener('click', function(e) {
		self.save();
	},false);
}

voyc.Editor.prototype.save = function() {
	var r = {};
	d = this.container.querySelector('#thai');
	r.t = d.value;
	r.trx = d.getAttribute('trx');
	r.id = d.getAttribute('did');
	r.g = d.getAttribute('g');
	r.tlm = (this.container.querySelector('#tlm').checked) ? 'm' : 'a';
	r.tl = this.container.querySelector('#translit').value;
	r.cpm = (this.container.querySelector('#cpm').checked) ? 'm' : 'a';
	r.cp = this.container.querySelector('#components').value;
	r.g = 'o';
	r.ru = 'cciov';

	r.mean = [];
	for (var i=0; i<this.numTrans; i++) {
		var m = {};
		var p = this.container.querySelector('#pos'+i);
		m.trx = p.getAttribute('trx');
		m.mid = p.getAttribute('mid');
		m.n = p.getAttribute('numdef');
		m.s = p.getAttribute('s');
		m.l = p.getAttribute('l');
		m.p = p.getAttribute('data');
		m.e = this.container.querySelector('#eng'+i).value;
		m.d = this.container.querySelector('#details'+i).value;
		r.mean.push(m);
	}
	this.dictionary.update(r);
}

voyc.Editor.prototype.joinComponents = function(lc,vp,fc,tm,tn) {
	var cp = [lc,vp,fc,tm,tn].join(',');
}

voyc.Editor.prototype.splitComponents = function(cp) {
	var p = cp.split(',');
	return { lc:p[0], vp:p[1], fc:p[2], tm:p[3], tn:p[4] };
}

voyc.Editor.prototype.initiate = function(w) {
}

voyc.Editor.prototype.clear = function() {
	var d = this.container.querySelector('#thai');
	d.value = '';
	d.setAttribute('trx','i');
	d.setAttribute('did',0);
	d.setAttribute('g','o');
	this.container.querySelector('#internals').innerHTML = '  '; 
	this.container.querySelector('#translit').value = '';
	this.container.querySelector('#translit').readOnly = true;
	this.container.querySelector('#tlm').checked = false;
	this.container.querySelector('#components').value = '';
	this.container.querySelector('#components').readOnly = true;
	this.container.querySelector('#cpm').checked = false;

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
	if (m.t == 'i') {
		this.clear();
		this.container.querySelector('#thai').value = m.n;
	}
	else if (m.t == 'u') {
		this.populate(m.m);
	}
	(new voyc.BrowserHistory).nav('editor');
	this.container.querySelector('#thai').focus();
}

voyc.Editor.prototype.populate = function(m) {
	var r = m[0];
	var trx = 'u';
	var d = this.container.querySelector('#thai');
	d.value = r.t;
	d.setAttribute('trx',trx);
	d.setAttribute('did',r.id);
	d.setAttribute('g',r.g);
	this.container.querySelector('#internals').innerHTML = [r.id,r.g].join();
	this.container.querySelector('#translit').value = r.tl;
	this.container.querySelector('#translit').readOnly = !(r.tlm == 'm');
	this.container.querySelector('#tlm').checked = (r.tlm == 'm');
	this.container.querySelector('#components').value = r.cp;
	this.container.querySelector('#components').readOnly = !(r.cpm == 'm');
	this.container.querySelector('#cpm').checked = (r.cpm == 'm');

	var t = this.container.querySelector('#translate');
	this.numTrans = m.length;
	for (var i=0; i<this.numTrans; i++) {
		var rn = m[i];
		var pos = t.querySelector('#pos'+i);
		pos.setAttribute('trx', trx);  // must be changed when new meanings added
		pos.setAttribute('mid', rn.mid);
		pos.setAttribute('numdef', rn.n);
		pos.setAttribute('s',r.s);
		pos.setAttribute('l',r.l);
		pos.setAttribute('data', rn.p);
		pos.value = this.posdisplay(rn.p);
		t.querySelector('#eng'+i).value = rn.e;
		t.querySelector('#details'+i).value = rn.d;
		t.querySelector('#trans'+i).classList.remove('hidden');
	}
	for (var i=this.numTrans; i<this.maxTrans; i++) {
		t.querySelector('#trans'+i).classList.add('hidden');
	}
	(new voyc.BrowserHistory).nav('editor');
	d.focus();
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
		<button id='tlbtn' toggle>Parse</button>
	</td></tr><tr><td>
		<label for='components'>Components</label>
	</td><td>
		<input id='components' type='text'/>
		<label for='cpm'><input type='checkbox' id='cpm' /> Manual</label>
	</td></tr>
</table>
<div id='translate'></div>
<div>
	<button>+ Add Translation</button>
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
		<select id='posselect%n' name='posselect' multiple class='hidden' size='8'>
			<option value='n'>noun</option>
			<option value='v'>verb</option>
			<option value='c'>conjunction</option>
			<option value='p'>preposition</option>
			<option value='j'>adjective</option>
			<option value='e'>adverb</option>
			<option value='r'>pronoun</option>
			<option value='a'>particle</option>
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
