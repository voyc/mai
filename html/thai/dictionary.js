/**
	class Dictionary
	singleton
	
	public function:
		translate(phrase)
**/
voyc.Dictionary = function() {
	this.unique = 10001000;

	var url = '/svc/';
	if (window.location.origin == 'file://') {
		url = 'http://mai.voyc.com/svc';  // for local testing
	}

	this.comm = new voyc.Comm(url, 'acomm', 2, true);
	this.observer = new voyc.Observer();

	this.fast = [];
	this.setup();

	this.mini = {
		list: [],
		key: {}
	}
}

voyc.Dictionary.prototype.miniDict = function(id) {
	return this.mini.list[this.mini.key[id]];
}

voyc.Dictionary.prototype.setup = function() {
	var self = this;
	this.observer.subscribe('getfast-received' ,'dictionary' ,function(note) { self.onGetFastReceived (note); });
	this.getFast();
}

voyc.Dictionary.prototype.getFast = function(o) {

	var svcname = 'getfast';

	// build data array of name/value pairs from user input
	var data = {};
	data['si'] = voyc.getSessionId();

	// call svc
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}

		self.observer.publish('getfast-received', 'mai', response);

		if (response['status'] == 'ok') {
			console.log('getfast success');
		}
		else {
			console.log('getfast failed');
		}
	});

	this.observer.publish('getfast-posted', 'mai', {});
	return;
}

voyc.Dictionary.prototype.onGetFastReceived = function(note) {
	this.fast = note.payload.list;
}

voyc.Dictionary.prototype.isEnglish = function(s) {
	if (typeof(s) == 'undefined')
		debugger;
	return (s.match(/^[ \?\-A-Za-z0-9]*$/));
}

voyc.Dictionary.prototype.lang = function(s) {
	return (this.isEnglish(s) ? 'e' : 't');
}

voyc.Dictionary.prototype.update = function(o) {

	var svcname = 'setdict';

	// build data array of name/value pairs from user input
	var data = {};
	data['si'] = voyc.getSessionId();
	data['up' ] = JSON.stringify(o);

	// call svc
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}

		self.observer.publish('setdict-received', 'mai', response);

		if (response['status'] == 'ok') {
			console.log('setdict success');
		}
		else {
			console.log('setdict failed');
		}
	});

	this.observer.publish('setdict-posted', 'mai', {});
	return;
}

/* get a set of words from the db, store in this.mini */
voyc.Dictionary.prototype.getDict = function(ida) {
	var svcname = 'getdict';
	var data = {};
	data['si'] = voyc.getSessionId();
	data['lk' ] = ida;
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}
		if (response['status'] == 'ok') {
			self.mini.list = response.list;
			self.mini.key = {};
			for (var i = 0; i<self.mini.list.length; i++) {
				var item = self.mini.list[i];
				self.mini.key[item.id] = i;
			}
			console.log('getdict success');
		}
		else {
			console.log('getdict failed');
		}
		self.observer.publish('getdict-received', 'mai', response);
	});

	this.observer.publish('getdict-posted', 'mai', {});
	return;
}

voyc.Dictionary.prototype.search = function(word, lang, typearray) {
	var svcname = 'search';

	// build data array of name/value pairs from user input
	var data = {};
	data['si'] = voyc.getSessionId();
	data['lk' ] = word;

	// call svc
	var self = this;
	this.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) {
			response = { 'status':'system-error'};
		}

		self.observer.publish('search-received', 'mai', response);

		if (response['status'] == 'ok') {
			console.log('search success');
		}
		else {
			console.log('search failed');
		}
	});

	this.observer.publish('search-posted', 'mai', {});
	return;
}

voyc.Dictionary.prototype.fastMatch = function(t) {
	for (var i=0; i<this.fast.length; i++) {
		if (this.fast[i].t.toLowerCase() == t.toLowerCase()) {
			return this.fast[i];
		}
	}
	return false;
}

//voyc.Dictionary.prototype.search = function(word, lang, typearray) {
//	var lang = lang || this.lang(word);
//	var typearray = typearray || false;
//	var m = [];
//	for (var i=0; i<this.dict.length; i++) {
//		if (this.dict[i][lang].toLowerCase() == word.toLowerCase()) {
//			if (!typearray || typearray.includes(this.dict[i].g)) {
//				m.push(this.dict[i]);
//			}
//		}
//	}
//	return m;
//}

voyc.Dictionary.prototype.translate = function(passage, lang) {
	var ilang = lang || this.lang(passage);
	var olang = (ilang == 't') ? 'e' : 't';

	var s = '';
	var w = passage.split(' ');
	for (var i=0; i<w.length; i++) {
		var m = this.search(w[i], ilang); // broken
		var e = '###';
		if (m && m.length && m[0][ilang]) {
			e = m[0][olang];
		}
		if (s.length) s += ' ';
		s += e;
	}
	return s;
}

voyc.Dictionary.prototype.translit = function(passage, lang) {
	var ilang = lang || this.lang(passage);
	var olang = (ilang == 't') ? 'e' : 't';

	var s = '';
	var w = passage.split(' ');
	for (var i=0; i<w.length; i++) {
		var m = this.search(w[i], ilang);  // broken
		var e = '###';
		if (m && m.length && m[0][ilang]) {
			e = m[0]['tl'];
			e += '<sup>' + m[0].tn + '</sup>';
		}
		if (s.length) s += ' ';
		s += e;
	}
	return s;
}

voyc.Dictionary.prototype.iterate = function(cb,primaryOnly) {
	primaryOnly = primaryOnly || true;
	for (var i=0; i<this.dict.length; i++) {
		if (primaryOnly && this.dict[i].n > 1) {
			continue;
		}
		cb(this.dict[i],i);
	}
}

voyc.Dictionary.prototype.checkDupes = function() {
	var s = '';
	var prev = {};
	var dupe = 0;
	var cnt = 0;
	var dupecnt = 0;
	this.iterate(function(m,i) {
		cnt++;
		if (m.t == prev.t && m.n == prev.n) {
			if (dupe == 0) {
				s += prev.t + ' ' + prev.n + ':' + prev.e + '<br/>' ;
				dupecnt++;
			}
			s += m.t + ' ' + m.n + ':' + m.e + '<br/>' ;
			dupe++;
		}
		else {
			dupe = 0;
		}
		prev = m;
	});
	s = dupecnt + ' dupes' + '<br/>' + s;
	s = cnt + ' total' + '<br/>' + s;
	return s;
}

voyc.Dictionary.prototype.listAll = function() {
	var s = ''
	s += this.dict.length + ' total' + '<br/>';
	var cnt = 0;
	this.iterate(function(m,i) {
		s += m.t + '\t' + m.n + '\t' + m.p + '\t' + m.e + '<br/>';
		if (m.p && m.e) {
			cnt++;
		}
	});
	s = cnt + ' active' + '<br/>' + s;
	return s;
}

/**
	compose(dict)
	input dict can be a single dict object or an array of dict objects
	output is a string of html
**/
voyc.Dictionary.prototype.compose = function(dict) {
	var da = dict;
	if (!Array.isArray(da)) {
		da = [];
		da.push(dict);
	}

	var s = '';
	for (var i=0; i<da.length; i++) {
		s += this.composeOne(da[i]);
	}
	return s;
}

voyc.Dictionary.prototype.composeOne = function(dict) {
	var s = '<search>';
	this.unique++;
	switch (dict.g) {
		case 'g':
			if (dict.p == 't') {
				s += dict.t + "  tone mark";
			}
			else {
				s += dict.t + "  " + voyc.strp[dict.p] + ", " + voyc.strm[dict.m] + ", sound: " + dict.e;
			}
			break;
		case 'o':
			s += dict.t;
			s += " <icon type='draw' name='speaker' text='"+dict.t+"'></icon> &nbsp;";
			s += "<span expand='rules"+this.unique+"'>" + this.drawTranslit(dict.tl) + "</span>";
			s += " <i>" + voyc.pos[dict.p] + "</i> " + dict.e;
			s += "<span expand='more"+this.unique+"' class='expander'></span>";
			s += "<icon type='char' name='pencil' text='"+dict.t+"'></icon>";
			s += "<div id='more"+this.unique+"'>";
			s += dict.d;
			s += '</div>';
			s += "<div id='rules"+this.unique+"'>";
			s += this.drawComponents(dict.cp, dict.ru);
			s += '</div>';
			break;
		case 'm':
			s += dict.t;
			s += " <icon type='draw' name='speaker' text='"+dict.t+"'></icon> &nbsp;";
			s += this.drawTranslit(dict.tl) + " <i>" + voyc.pos[dict.p] + "</i> " + dict.e;
			s += "<span expand='more"+this.unique+"' class='expander'></span>";
			s += "<icon type='char' name='pencil' text='"+dict.t+"'></icon>";
			s += "<div id='more"+this.unique+"'>";
			s += dict.d;
			if (dict.ru && dict.ru.length) {
				s += '<br/>Rules:';
				var ru = dict.ru.split(',');
				for (var i=0; i<ru.length; i++) {
					s += '<br/> '+voyc.dictionary.drawRule(ru[i]);
				}
			}
			s += '</div>';
			break;	
		case 's':
			s += dict.t + "  symbol";
			break;	
		case 'x':
			s += dict.t + "  " + dict.tl + " " + dict.e;
			break;
	}
	s += '</search>';
	return s;
}

voyc.Dictionary.prototype.drawClass = function(glyph) {
	return voyc.strm[glyph];	
}

voyc.Dictionary.prototype.drawDiacritic = function(glyph) {
	var t = glyph.t;
	if ('abr'.includes(glyph.a)) {
		t = '&#9676' + t;
	}
	if ('l' == glyph.a) {
		t = t + '&#9676';
	}
	return t;
}

voyc.Dictionary.prototype.drawRule = function(rule) {
	var s = '';
	for (var i=0; i<voyc.ru.length; i++) {
		if (voyc.ru[i].code == rule) {
			s += voyc.ru[i].name;
			break;
		}

	}
	return s;
}

voyc.Dictionary.prototype.drawTranslit = function(tl) {
	if (!tl) return '';
	var s = '';
	s += tl.replace(/([FRLMH])/g, function(x) {
		return '<sup>'+x+'</sup>';
	});
	return s;
}

voyc.Dictionary.prototype.joinComponents = function(lc,vp,fc,tm,tn) {
	var cp = [lc,vp,fc,tm,tn].join(',');
}

voyc.Dictionary.prototype.splitComponents = function(cp) {
	var p = cp.split(',');
	return { lc:p[0], vp:p[1], fc:p[2], tm:p[3], tn:p[4] };
}

voyc.Dictionary.prototype.drawComponents = function(cp,ru) {
	var s = '';
	if (cp && cp.length) {
		var cpo = this.splitComponents(cp);
		var lc = voyc.alphabet.search(cpo.lc[cpo.lc.length-1]);
		s += 'leading consonant ' + lc.t + ' ' + this.drawClass(lc.m);
		var vp = voyc.vowelPatternsLookup(cpo.vp);
		s += '<br/>vowel pattern ' + vp.print + ' ' + this.drawClass(vp.m);

		if (cpo.fc) {
			s += '<br/>final consonant ' + cpo.fc;
		}
		if (cpo.tm) {
			var tm = voyc.alphabet.search(cpo.tm);
			s += '<br/>tone mark ' + this.drawDiacritic(tm);
		}
	}
	if (ru.length) {
		s += '<br/>Rules:';
		var ru = ru.split(',');
		for (var i=0; i<ru.length; i++) {
			s += '<br/> '+this.drawRule(ru[i]);
		}
	}
	return s;
}

/* static code tables */
voyc.pos = {
	'n':'noun',
	'v':'verb',
	'c':'conj',
	'p':'prep',
	'j':'adj',
	'e':'adv',
	'r':'pron',
	'a':'part',
	'g':'glyph',
	's':'syllable',
};
voyc.strp = {
	c:"consonant",
	v:"vowel",
	t:"tone mark"
}
voyc.strm = {
	s:"short",
	o:"long",
	m:"middle class",
	l:"low class",
	h:"high class"
}

/* static table of rules */ 
voyc.ru = [
	// endings
	{code:'fsc', name:'final sonorant consonant: live'},
	{code:'fnsc', name:'final non-sonorant consonant: dead'},

	// tones
	{code:'ovs', name:'Open vowel short: dead'},
	{code:'ovl', name:'Open vowel long: live'},
	{code:'mcl', name:'Mid-class live: M'},
	{code:'mcd', name:'Mid-class dead: L'},
	{code:'mc1', name:'Mid-class mai eak: L'},
	{code:'mc2', name:'Mid-class mai toh: F'},
	{code:'mc3', name:'Mid-class mai dtree: H'},
	{code:'mc4', name:'Mid-class mai chatawa: R'},
	{code:'hcl', name:'High-class live: R'},
	{code:'hcd', name:'High-class dead: L'},
	{code:'hc1', name:'High-class mai eak: L'},
	{code:'hc2', name:'High-class mai toh: F'},
	{code:'lcl', name:'Low-class live: M'},
	{code:'lcds', name:'Low-class dead short: H'},
	{code:'lcdl', name:'Low-class dead long: F'},
	{code:'lc1', name:'Low-class mai eak: F'},
	{code:'lc2', name:'Low-class mai toh: H'},

	// silent tone mark on ending consonant

	// consonant clusters
	{code:'cct', name:'True consonant cluster', details:'English-speakers call this a dipthong.  Combine multiple consonants into a single sound. { ก, ข, ค, ต, ป, ผ, พ } + { ร, ล, ว } '},
	{code:'ccf', name:'False consonant cluster', details:'One of five consonants (จ, ซ, ท, ส, ศ) followed by a silent ร.'},
	{code:'cclh', name:'consonant cluster with leading ห', details:'The ห is not pronounced, but is used to raise the class of the next consonant in the cluster to high class.  Similar to how a tone mark is used.'},
	{code:'cclha', name:'consonant cluster with leading อ', details:'The อ is not pronounced, but is used to raise the class of the next consonant in the cluster to high class.  This applies to only four words:  .'},
	{code:'ccredup', name:'Reduplication', details:'A single consonant is used twice, as the end of the previous syllable, and the beginning of the next.'},
	{code:'ccivo', name:'Inherent vowel, short o', details:'A short o sound invoked between initial and final consonant.'},
	{code:'cciva', name:'Inherent vowel, short a', details:'A short a sound invoked with one standalone consonant.'},
	{code:'ccive', name:'Inherent vowel, short a, enepenthetic', details:'A short a sound inserted between two incompatible consonants, creating an extra syllable instead of a dipthong.'},
];


