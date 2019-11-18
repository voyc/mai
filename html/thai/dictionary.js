/**
	class Dictionary
	singleton
	
	public function:
		translate(phrase)
**/
/**
Sources
1. by hand

2. http://www.thai-language.com/ref/starred
	https://docs.google.com/spreadsheets/d/1zgcZH80RBbUD4m3h43UAsPLY0LbhTMTnQvoawRyKg6E/edit?usp=sharing
	(.*?)\t(.*?)$
	{t:'$1'\t,e:'$2'},

3. original dict file ,with tones and hints

See also 
https://youtu.be/Gkj5AlcxmUE 100 phrases

columns
	t:thai language word
	e:english language word
	d:english language details
	s:source (1,2,3,...)
	n:definition number (1,2,3,...)
	l:level (100,200,300,...)
	p:part of speech
		n:noun
		v:verb
		c:conjunction
		p:preposition
		j:adjective
		e:adverb
		r:pronoun
		a:particle
		g:glyph
		s:syllable
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

voyc.Dictionary.prototype.lookup = function(word, lang) {
	lang = lang || this.lang(word);
	var m = [];
	for (var i=0; i<this.dict.length; i++) {
		if (this.dict[i][lang].toLowerCase() == word.toLowerCase()) {
			m.push(this.dict[i]);
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
