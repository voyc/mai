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
	
	this.numTrans = 1;
	this.maxTrans = 5;
	this.setup();
}

voyc.Editor.prototype.setup = function() {
	this.lang = 'thai';
	var self = this;
	this.observer.subscribe('edit-requested', 'editor', function(note) {self.populate(note.payload);});

	this.container.innerHTML = voyc.Editor.template.page;

	var translate = this.container.querySelector('#translate');
	for (var i=0; i<this.maxTrans; i++) {
		var d = document.createElement('div');
		d.id = 'trans'+i;
		d.setAttribute('name', 'trans');
		d.innerHTML = voyc.Editor.template.trans.replace(/%n/g,i);
		translate.appendChild(d);
	}		

	(new voyc.Minimal).attachAll(this.container);

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
		(new voyc.BrowserHistory).nav('home');
	},false);
	voyc.$('savebtn').addEventListener('click', function(e) {
		self.save();
		(new voyc.BrowserHistory).nav('home');
	},false);
}

voyc.Editor.prototype.save = function() {
/*
	var r = this.dbarray[0];
	if (new) {
		r = {};
	}
	r.tlm = (this.container.querySelector('#tlm').checked) ? 'm' : 'a';
	r.tl = this.container.querySelector('#translit').value;
	r.cpm = (this.container.querySelector('#cpm').checked) ? 'm' : 'a';
	r.cp = this.container.querySelector('#components').value;
	
	id:id
	g:type (o,m)
	ru:rules (csv)

	for (this.dbarray
	loop --- meaning ---
	    id:serial unique key
	    fid:did (foreign key to dict table)
	    n:numdef, definition number (1,2,3,...)
	    p:pos, (n,v,c,p,j,e,r,a)
	    e:eng, one word in english language
	    d:details, phrase in english language
	    s:source (0-5)
	    l:level (100,200,300,...)
*/
}

voyc.Editor.prototype.joinComponents = function(lc,vp,fc,tm,tn) {
	var cp = [lc,vp,fc,tm,tn].join(',');
}

voyc.Editor.prototype.splitComponents = function(cp) {
	var p = cp.split(',');
	return { lc:p[0], vp:p[1], fc:p[2], tm:p[3], tn:p[4] };
}

voyc.Editor.prototype.populate = function(m) {
	this.dbarray = m.m;
	var r = this.dbarray[0];
	this.container.querySelector('#thai').value = r.t;
	this.container.querySelector('#internals').innerHTML = [r.id,r.s,r.l,r.g].join();
	this.container.querySelector('#translit').value = r.tl;
	this.container.querySelector('#tlm').checked = (r.tlm == 'm');
	this.container.querySelector('#components').value = r.cp;
	this.container.querySelector('#cpm').checked = (r.cpm == 'm');

	var t = this.container.querySelector('#translate');
	this.numTrans = this.dbarray.length;
	for (var i=0; i<this.numTrans; i++) {
		var rn = this.dbarray[i];
		var pos = t.querySelector('#pos'+i);
		pos.setAttribute('data', rn.p);
		pos.value = this.posdisplay(rn.p);
		t.querySelector('#eng'+i).value = rn.e;
		t.querySelector('#details'+i).value = rn.d;
		t.querySelector('#trans'+i).classList.remove('hidden');
	}
	for (var i=this.numTrans; i<this.maxTrans; i++) {
		t.querySelector('#trans'+i).classList.add('hidden');
	}
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
		<input id='translit' type='text' readonly/>
		<label for='tlman'><input name='tlman' type='checkbox' id='tlman' value='co' /> Manual</label>
		<button id='tlbtn' toggle>show</button>
	</td></tr><tr><td>
		<label for='components'>Components</label>
	</td><td>
		<input id='components' type='text' />
		<label for='compexp'><input name='compexp' type='checkbox' id='compexp' value='co' /> Override</label>
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
<fieldset><legend>Translation %n</legend>
<table class='dedit'>	
	<tr><td>	
		<label for='pos'>Parts of Speech</label>
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
