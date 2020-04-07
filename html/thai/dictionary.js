/**
	class Dictionary
	singleton
	
	public function:
		translate(phrase)
**/
/**
columns
	--- key ---	
	id:id
	g:type
		g:glyph
		s:syllable, not yet used
		o:one-syllable word
		m:multi-syllable word
	t:thai, one word in thai language

	--- meaning ---
	s:source
		0:86, unspecified
		1:97, by hand
		2:1150, thai-language.com/starred
		3:66, original dict file, with tones and hints
		4:6, ?
		5:39, ?
	l:level (100,200,300,...)
	n:numdef, definition number (1,2,3,...)
	p:pos, part of speech, can apply only to word (g=o, g=m)
		n:noun
		v:verb
		c:conjunction
		p:preposition
		j:adjective
		e:adverb
		r:pronoun
		a:particle
 		?:proper noun
	e:eng, one word in english language
	d:details, phrase in english language

	--- glyph ---
	u:unicode
	r:reference, for sanskrit consonant, the equivalent consonant
	m:class
		m:middle class consonant
		l:low class consonant
		h:high class consonant
		v:vowel
		u:unknown for glyph
		o:obsolete glyph: ฃ, ฅ
		s:symbol glyph: ฿, ๆ, ฯ 
		t:tonemark
		d:digit
	a:subclass
		d:diacritic vowel or tonemark - 
		s:sonorant consonant
		a:diacritic above
		b:diacritic below
		l:diacritic left
		r:diacritic right
	
	--- syllable and one-syllable word ---
	lc:leadingconsonant
	fc:finalconsonant
	vp:vowelpattern
	tm:tonemark
	tn:tone M,L,H,R,F
	tl:translit
	ru:rules
	
	--- multi-syllable word and phrase ---
	ns:numsyllables
	sn:syllablendx, csv
	cp:components, csv
	ps:parse, m:manual
**/
voyc.Dictionary = function() {
	this.dict = [];
	this.load();
}

voyc.Dictionary.prototype.load = function() {
	this.dict = voyc.dict;
//	this.dict.sort(function(a,b) {
//		return a.t.localeCompare(b.t);
//	});
}

voyc.Dictionary.prototype.isEnglish = function(s) {
	if (typeof(s) == 'undefined')
		debugger;
	return (s.match(/^[ \?\-A-Za-z0-9]*$/));
}

voyc.Dictionary.prototype.lang = function(s) {
	return (this.isEnglish(s) ? 'e' : 't');
}

voyc.Dictionary.prototype.lookup = function(word, lang, typearray) {
	var lang = lang || this.lang(word);
	var typearray = typearray || false;
	var m = [];
	for (var i=0; i<this.dict.length; i++) {
		if (this.dict[i][lang].toLowerCase() == word.toLowerCase()) {
			if (!typearray || typearray.includes(this.dict[i].g)) {
				m.push(this.dict[i]);
			}
		}
	}
	return m;
}

voyc.Dictionary.prototype.translate = function(passage, lang) {
	var ilang = lang || this.lang(passage);
	var olang = (ilang == 't') ? 'e' : 't';

	var s = '';
	var w = passage.split(' ');
	for (var i=0; i<w.length; i++) {
		var m = this.lookup(w[i], ilang);
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
		var m = this.lookup(w[i], ilang);
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
	var s = '<lookup>';
	var unique = new Date().getTime();
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
			s += dict.tl + "<sup>" + dict.tn + "</sup>  <i>" + voyc.pos[dict.p] + "</i> " + dict.e;
			s += "<span expand='more"+unique+"' class='expander'></span>";

			s += "<div id='more"+unique+"'>";
			s += dict.d;
			var lc = this.lookup(dict.lc[dict.lc.length-1])[0];
			s += '<br/>leading consonant ' + lc.t + ' ' + this.drawClass(lc.m);
			var vp = voyc.vowelPatternsLookup(dict.vp);
			s += '<br/>vowel pattern ' + vp.print + ' ' + this.drawClass(vp.m);

			if (dict.fc) {
				s += '<br/>final consonant ' + dict.fc;
			}
			if (dict.tm) {
				var tm = this.lookup(dict.tm)[0];
				s += '<br/>tone mark ' + this.drawDiacritic(tm);
			}
			if (dict.ru.length) {
				s += '<br/>Rules:';
				var ru = dict.ru.split(',');
				for (var i=0; i<ru.length; i++) {
					s += '<br/> '+voyc.dictionary.drawRule(ru[i]);
				}
			}
			s += '</div>';
			break;
		case 'm':
			s += dict.t + "  " + dict.tl + " <i>" + voyc.pos[dict.p] + "</i> " + dict.e;
			break;	
		case 's':
			s += dict.t + "  symbol";
			break;	
		case 'x':
			s += dict.t + "  " + dict.tl + " " + dict.e;
			break;
	}
	s += '</lookup>';
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

