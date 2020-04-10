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
	this.setup();
}

voyc.Editor.prototype.setup = function() {
	this.lang = 'thai';
	var self = this;
	this.isOpenAlready = false;
	this.observer.subscribe('editor-requested', 'editor', function(note) {self.drawEditor();});
	this.observer.subscribe('edit-requested', 'editor', function(note) {self.populate(note.payload);});
}

voyc.Editor.prototype.drawEditor = function() {
	var s = '';
	s += voyc.Editor.template;
	this.container.innerHTML = s;
	this.attachDomEventHandlers();
	(new voyc.Minimal).attachAll(this.container);
}

voyc.Editor.prototype.attachDomEventHandlers = function() {
	var self = this;
	voyc.$('pos').addEventListener('focus', function(e) {
		posopen();
	},false);
	voyc.$('posselect').addEventListener('blur', function(e) {
		posclose();
	},false);
	posset('nja');
	voyc.$('tlbtn').addEventListener('click', function(e) {
		var b = voyc.$('pronunciation').classList.contains('hidden');
		if (b) {
			voyc.$('pronunciation').classList.remove('hidden');
			voyc.$('translations').classList.add('hidden');
		}
		else {
			voyc.$('pronunciation').classList.add('hidden');
			voyc.$('translations').classList.remove('hidden');
		}
	},false);
	voyc.$('cancelbtn').addEventListener('click', function(e) {
		(new voyc.BrowserHistory).nav('home');
	},false);
	voyc.$('savebtn').addEventListener('click', function(e) {
		(new voyc.BrowserHistory).nav('home');
	},false);
}

voyc.Editor.prototype.populate = function(o) {
	//lookup word
	voyc.$('thai').value = o.word;
}

/*
	convert from data to display format
		input data='nja'; 
		output display='noun,adj,article';
*/
function posdisplay(data) {
	var s = '';
	var a = data.split('');
	for (var i=0; i<a.length; i++) {
		if (s) s += ',';
		s += voyc.pos[a[i]];
	}
	return s;
}
function posset(indata) {
	var pos = voyc.$('pos');
	pos.setAttribute('data', indata);
	pos.value = posdisplay(indata);
}

function posopen() {
	var pos = voyc.$('pos');
	var possel = voyc.$('posselect');
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

function posclose() {
	var pos = voyc.$('pos');
	var possel = voyc.$('posselect');
	var data = '';
	var nodes = possel.querySelectorAll('option');
	for (var i=0; i<nodes.length; i++) {
		if (nodes[i].selected) {
			data += nodes[i].value;
		}
	}
	pos.setAttribute('data', data);
	pos.value = posdisplay(data);
	pos.classList.remove('hidden');
	posselect.classList.add('hidden');
}

voyc.Editor.template = `
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
		<button id='tlbtn' toggle>show</button>
	</td></tr>
</table>

<div id='translations'>
	<p>
		<label for='components'>Components <input id='components' type='text' /></label>
		<label for='compexp'><input name='compexp' type='checkbox' id='compexp' value='co' /> Override</label>
		<button>Parse</button>
	</p>
<fieldset><legend>Translation 1</legend>
<table class='dedit'>	
	<tr><td>	
		<label for='pos'>Parts of Speech</label>
	</td><td>
		<input id='pos' type='text' data='nja'/>
		<select id='posselect' multiple class='hidden' size='8'>
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
		<input id='eng' type='text' />
	</td></tr><tr><td>
		<label for='details'>Details</label
	</td><td>
		<input id='details' type='text' />
	</td></tr>
</table>
</fieldset>	
	
	<button>+ Add Translation</button>
</div>

<div id='pronunciation' class='hidden'>
	<p>
		<label for='syllables'>Syllables<input id='syllables' type='text' /></label>
		<label for='sylexp'><input name='sylexp' type='checkbox' id='compexp' value='co' /> Override</label>
		<button>Parse</button>
	</p>

	<fieldset><legend>Syllables</legend>
		<p><label for='syl1'>1: <input type='text' id='syl1'></input></label></p>
		<p><label for='syl2'>2: <input type='text' id='syl2'></input></label></p>
		<p><label for='syl3'>3: <input type='text' id='syl3'></input></label></p>
		<p><label for='mrules'>Rules: <textarea id='mrules'></textarea></label></p>
	</fieldset>

<fieldset><legend>Syllable</legend>
<table class='dedit'>
	<tr><td>
		<label for='lc'>Leading Consonant</label>
	</td><td>
		<input id='lc' type='text' class='char' />
	</td></tr><tr><td>
		<label for='vp'>Vowel Pattern</label>
	</td><td>
		<input id='vp' type='text' class='char' />
	</td></tr><tr><td>
		<label for='fc'>Final Consonant</label>
	</td><td>
		<input id='fc' type='text' class='char' />
	</td></tr><tr><td>
		<label for='tm'>Tone Mark</label>
	</td><td>
		<input id='tm' type='text' class='char' />
	</td></tr><tr><td>
		<label for='tone'>Tone
	</td><td>
		<select id='tone'>
			<option value='H'>High</option>
			<option value='M'>Mid</option>
			<option value='L'>Low</option>
			<option value='R'>Rising</option>
			<option value='F'>Falling</option>
		</select></label>
	</td></tr><tr><td>
		<label for='rules'>Rules</label>
	</td><td>
		<div id='rules' class='field'>rule 1<br/>exception<br/>ho my</div>
	</td></tr>
</table>
</fieldset>
</div>
	<button id='savebtn'>Save</button>
	<button id='cancelbtn'>Cancel</button>	
`;
