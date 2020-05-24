/**
	class Alphabet
	singleton
	
	represent a list of glyph objects, one object for each char in the alphabet

	public methods:
		search(char) - return glyph object
		reverseSearch(char) - input english language char, return glyph object
		printDiacritic(glyph) - return string
		compose(glyph) - return string
		listall(none) - return string
		iterate(callback) - return none
**/
voyc.Alphabet = function() {
	this.list = [];
	this.key = {};
	this.loadList();
}

voyc.Alphabet.prototype.loadList = function() {
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

/**
	search, public method 
		input one char
		return one glyph object in the list, using char as key
**/
voyc.Alphabet.prototype.search = function(char) {
	var g = this.list[this.key[char]];
	return g;
	//if (g) {
	//	return g;
	//}
	//return this.reverseSearch(char);
}

/**
	reverseSearch, public method 
		input one english char
		return one glyph object in the list, using char as key
**/
voyc.Alphabet.prototype.reverseSearch = function(char) {
	for (var i=0; i<this.list.length; i++) {
		if (this.list[i].e == char) {
			return this.list[i];
		}
	}
	return null;
}

/**
	printDiacritic, public method 
		input glyph object
		return string printable glyph supporting diacritics
**/
voyc.Alphabet.prototype.printDiacritic = function(glyph) {
	var t = glyph.t;
	if (glyph.a == 'a' || glyph.a == 'b') {
		t = '&#9676' + t;
	}
	return t;
}

/**
	compose, public method 
		input glyph object
		return string printable glyph for command how -glyph <char>
**/
voyc.Alphabet.prototype.compose = function(m) {
	return this.printDiacritic(m) + ', ' + m.e + ', ' + voyc.Alphabet.strm[m.m] + ', ' + voyc.Alphabet.stra[m.a] + '<br/>';
}

/**
	compose, public method 
		input none
		return string printable entire alphabet, compose
**/
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

/**
	iterate, public method 
		input callback function
		execute the callback on every item in the alphabet
		return none
**/
voyc.Alphabet.prototype.iterate = function(cb) {
	for (var i=0; i<this.list.length; i++) {
		cb(this.list[i],i);
	}
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
