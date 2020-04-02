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
