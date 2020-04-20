/**
	class Alphabet
	singleton
	
	public function:
**/
voyc.Alphabet = function() {
	this.list = [];
	this.key = {};
	this.loadTable();
}

voyc.Alphabet.prototype.loadTable = function() {
	var svcname = 'getalpha';
	var data = {};
	var self = this;

	// on return from svc
	voyc.observer.subscribe(svcname + '-received', 'alphabet', function(note) {
		if (note.payload.status != 'ok') return;
		self.list = note.payload.list;
		for (var i=0; i<self.list.length; i++) {
			self.key[self.list[i].t] = i;
		}
	});

	// call svc
	voyc.comm.request(svcname, data, function(ok, response, xhr) {
		if (!ok) response = { 'status':'system-error'};
		console.log(svcname + ' status ' + response['status']); // ok
		voyc.observer.publish(svcname + '-received', 'alphabet', response);
	});
	voyc.observer.publish(svcname + '-posted', 'alphabet', {});
}

voyc.Alphabet.prototype.search = function(glyph) {
	return this.list[this.key[glyph]];
}
/*
voyc.Alphabet.prototype.isEnglish = function(s) {
	return (s.match(/^[ \?\-A-Za-z0-9]*$/));
}

voyc.Alphabet.prototype.lang = function(s) {
	return (this.isEnglish(s) ? 'e' : 't');
}

voyc.Alphabet.prototype.xlookup = function(word,lang) {
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
*/
voyc.Alphabet.prototype.printDiacritic = function(glyph) {
	var t = glyph.t;
	if (glyph.a == 'a' || glyph.a == 'b') {
		t = '&#9676' + t;
	}
	return t;
}

voyc.Alphabet.prototype.iterate = function(cb) {
	for (var i=0; i<this.list.length; i++) {
		cb(this.list[i],i);
	}
}

voyc.Alphabet.prototype.compose = function(m) {
	return this.printDiacritic(m) + ', ' + m.e + ', ' + voyc.Alphabet.strm[m.m] + ', ' + voyc.Alphabet.stra[m.a] + '<br/>';
}

voyc.Alphabet.prototype.listAll = function() {
	var s = ''
	var cnt = 0;
	var self = this;
	this.iterate(function(m,i) {
		s += self.compose(m);
		cnt++;
	});
	return s;
}

/* static code tables */
voyc.Alphabet.strm = {
	m:'middle class consonant',
	l:'low class consonant',
	h:'high class consonant',
	v:'vowel',
	u:'unknown',
	o:'obsolete', // ฃ, ฅ',
	s:'symbol',   // ฿, ๆ, ฯ',
	t:'tonemark',
	d:'digit',
	b:'both', // ฤ, a sanskrit ligature (consonant+vowel), pronounced ริ
};

voyc.Alphabet.stra = {
	s:'sonorant',
	a:'diacritic above',
	b:'diacritic below',
	l:'diacritic left',
	r:'diacritic right',
	'':''
};
