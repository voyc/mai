/**
	class Alphabet
	singleton
	
	public function:
**/
voyc.Alphabet = function(dictionary) {
	this.dictionary = dictionary;
}

voyc.Alphabet.prototype.isEnglish = function(s) {
	return (s.match(/^[ \?\-A-Za-z0-9]*$/));
}

voyc.Alphabet.prototype.lang = function(s) {
	return (this.isEnglish(s) ? 'e' : 't');
}

voyc.Alphabet.prototype.lookup = function(word,lang) {
	var lang = lang || this.lang(word);
	var m = {};
	if (word) {
		this.iterate(function(a) {
			if (a[lang].toLowerCase() == word.toLowerCase()) {
				m = a;
			}
		});
	}
	return m;
}

voyc.Alphabet.prototype.printDiacritic = function(glyph) {
	var t = glyph.t;
	if (glyph.a == 'd') {
		t = '&#9676' + t;
	}
	return t;
}

voyc.Alphabet.prototype.iterate = function(cb) {
	this.dictionary.iterate(function(a,i) {
		if (a.g == 'g') {
			cb(a,i);
		}
	});
}

voyc.Alphabet.prototype.listAll = function() {
	var s = ''
	s += this.alpha.length + ' total' + '<br/>';
	var cnt = 0;
	this.iterate(function(m,i) {
		s += voyc.alphabet.printDiacritic(m) + '\t' + m.e + '\t' + m.p + '<br/>';
		cnt++;
	});
	s = cnt + ' active' + '<br/>' + s;
	return s;
}
