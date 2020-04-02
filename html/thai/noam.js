/**
	class Noam
	singleton

	Noam, as in Noam Chomsky, famous linguist, 
	does all the linquistic and grammar analysis.

	Requires the prescence of dictionary and vocab data.

	public methods:
		collect()
		parse(input) - return two arrays of words: matched and unmatched
		parseSyllable(syllable) - return object of components
		parseWordToGlyphs(word,options {newOnly t/f, format glyph/dict})
		parseStoryBySpace(story,options {newOnly t/f, format word/dict})
		parsePhrase() - obsolete
		parseWord() - obsolete

		parse by newlines - return array of lines
		parse by speaker - return dialog
		parse by whitespace - return list of contiguous strings
		parse by dictionary - return list of words
		analyze syllable - used only in preparing dictionary
		analyze word - break into component syllables
		parse by glyph - return array of glyphs 
	
		things we drill
			glyphs
			words, incl syllables
			phrases
			expressions
			sentences	
**/
voyc.Noam = function(dictionary,vocab) {
	this.dictionary = dictionary;
	this.vocab = vocab;
	voyc.vowelPatternsInit();
	this.alphabet = new voyc.Alphabet(dictionary);
}

/**
	is input phrases, story, or words?
	input: list of phrases
	output: list of glyphs, list of words
**/
//voyc.Noam.prototype.prereq = function(phrases) {
//	var word = [];
//	for (var i=0; i<phrases.length; i++) {
//		var words = this.parsePhrase(phrases[i]);
//		for (var j=0; j<words.length; j++) {
//			var v = this.vocab.get(words[j])
//			if (!v) {
//				word.push(words[j]);
//			}
//		}
//	}
//
//	var glyph = [];
//	for (var i=0; i<word.length; i++) {
//		var glyphs = this.parseWord(word[i]);
//		for (var j=0; j<glyphs.length; j++) {
//			var v = this.vocab.get(glyphs[j]);
//			if (!v) {
//				glyph.push(glyphs[j]);
//			}
//		}
//	}
//	return [ word, glyph ];
//}
//
//voyc.Noam.prototype.parsePhrase = function(phrase) {
//	return phrase.split(' ');
//}
//
//voyc.Noam.prototype.parseWord = function(word) {
//	return word.split('');
//}

voyc.Noam.prototype.eliminateDupes = function(a) {
	a.sort();
	var b = [];
	var prev = '';
	a.forEach(function(i) {
		if (i != prev) {
			b.push(i);
		}
		prev = i;
	}, this);
	b = voyc.shuffleArray(b);
	return b;
}

voyc.Noam.prototype.parseWordToGlyphs = function(words,options) {
	var settings = {
		newGlyphsOnly: true,
		format: 'word',
	}
	var glyph = [];
	words.forEach(function(word) {
		var glyphs = word.split('');
		glyphs.forEach(function(g) {
			var bVocab = false;
			if (settings.newGlyphsOnly) {
				bVocab = this.vocab.get(g);
			}
			if (!bVocab) {
				glyph.push(g);
			}
		}, this);

	}, this);

	glyph = this.eliminateDupes(glyph);

	if (settings.format == 'dict') {
		var dict = [];
		glyph.forEach(function(g) {
			var d = voyc.dictionary.lookup(g)[0];
			dict.push[d];
		}, this);
		glyph = dict;
	}
	return glyph;
}

voyc.Noam.prototype.parseStoryBySpace = function(story,options) {
	var settings = {
		newWordsOnly: true,
		format: 'word',
	}
	var word = [];
	story.forEach(function(phrase) {
		var words = phrase.split(' ');
		words.forEach(function(w) {
			var bVocab = false;
			if (settings.newWordsOnly) {
				var d = this.vocab.get(w);
				bVocab = (d && (d.s == 'm'));
			}
			if (!bVocab) {
				word.push(w);
			}
		}, this);

	}, this);

	word = this.eliminateDupes(word);

	if (settings.format == 'dict') {
		var dict = [];
		word.forEach(function(w) {
			var d = voyc.dictionary.lookup(w)[0];
			if (!d) {
				console.log('word '+w+' not in dictionary.');
			}
			else {
				dict.push[d];
			}
		}, this);
		word = dict;
	}
	return word;
}

voyc.Noam.prototype.analyzeWord = function(word) {
	var wordEng = [];
	word.forEach(function(w) {
		wordEng.push(this.dictionary.translate(w));
	}, this);

	dictOld = [];
	dictNew = [];
	wordErr = [];
	word.forEach(function(w) {
		var d = voyc.dictionary.lookup(w)[0];
		if (!d) {
			wordErr.push(w);
		}
		else {
			var v = this.vocab.get(w);
			var bVocab = (v && (v.s == 'm'));
			if (bVocab) {
				dictOld.push(d);
			}
			else {
				dictNew.push(d);
			}
		}
	}, this);
	return {new:dictNew, old:dictOld, err:wordErr, wordeng:wordEng};
}

// analyze phrases assuming a space between words
voyc.Noam.prototype.analyzeStory = function(story) {
	var word = [];
	var wordEng = [];
	var phraseEng = [];
	story.forEach(function(phrase) {
		phraseEng.push(this.dictionary.translate(phrase));
		var words = phrase.split(' ');
		words.forEach(function(w) {
			word.push(w);
			wordEng.push(this.dictionary.translate(w));
		}, this);

	}, this);

	word = this.eliminateDupes(word);

	dictOld = [];
	dictNew = [];
	wordErr = [];
	word.forEach(function(w) {
		var d = voyc.dictionary.lookup(w)[0];
		if (!d) {
			wordErr.push(w);
		}
		else {
			var v = this.vocab.get(w);
			var bVocab = (v && (v.s == 'm'));
			if (bVocab) {
				dictOld.push(d);
			}
			else {
				dictNew.push(d);
			}
		}
	}, this);
	return {new:dictNew, old:dictOld, err:wordErr, pheng:phraseEng};
}

/* 
	input htmldoc
	output array of objects: original, gendered, speaker, display, speech
	switch vocabulary for gender
	add styles for display
*/

voyc.Noam.prototype.analyzeDialog = function(s) {
	var d = {
		speakers:{ 'x': {name:'narrator',age:40,gender:'male'} },
		dialog:[],
		new:[],
		old:[],
		err:[]
	};

	// treat input s as an array of lines
	var a = s.split('\n');

	// trim whitespace and remove empty lines
	for (var i=0; i<a.length; i++) {
		a[i] = a[i].trim();
		if (a[i].length <= 1) {
			a.splice(i,1);
			i--;
		}
	}

	// identify speakers, remove speaker definition lines (key:: name,age,gender)
	for (var i=0; i<a.length; i++) {
		var s = a[i].split(':: ');
		if (s.length > 1) {
			var o = {};
			var key = s[0];
			var b = s[1].split(',');
			o.name = b[0];
			o.age = parseInt(b[1]);
			o.gender = b[2].substr(0,1);
			d.speakers[key] = o; 
			a.splice(i,1);
			i--;
		}
	}

	// create one object for each line of dialog
	for (var i=0; i<a.length; i++) {
		var o = {};
		o.original = a[i];
		o.speaker = assignSpeaker(o.original);
		o.text = assignText(o.original);
		o.speech = prepSpeech(o.text);
		o.display = prepDisplay(o);
		d.dialog.push(o);
	}

	// parse for words
	for (var i=0; i<d.dialog.length; i++) {
		var line = d.dialog[i].text;
		var a = this.parse(line);
		d.dialog[i].words = a.match;
		d.dialog[i].nomatch = a.nomatch;
		d.new = d.new.concat(a.match);
		d.err = d.err.concat(a.nomatch);
	}
	d.new = this.eliminateDupes(d.new);
	d.err = this.eliminateDupes(d.err);
	return d;

	function assignSpeaker(orig) {
		var key = 'x';
		var c = orig.split(':');
		if (c.length > 1) {
			key = c[0];
		}
		return key;
	}

	function assignText(orig) {
		var text = orig;
		var c = orig.split(': ');
		if (c.length > 1) {
			text = c[1];
		}
		//gen.text = orig.replace(/me/g, gender.me);
		//gen.text = orig.replace(/polite/g, gender.polite);
		return text;
	}

	function prepSpeech(text) {
		var sp = text;
		sp = sp.replace(/ /g, '. ');
		return sp;
	}

	function prepDisplay(o) {
		var disp = '';
		if (o.speaker != 'x') {
			disp = o.speaker + ': ' + o.text;
		}
		return disp;
	}
}

/**
	Collect a list of words that contain 
	only glyphs already mastered or working.
	@return array of words
*/
voyc.Noam.prototype.collectWords = function(target, options) {
	var settings = {
		newWordsOnly: false,
		targetGlyphsOnly: false,
		sort: true,
		limit: 8,
		format:'dict', //'word'
	}
	if (options) {
		for (var key in options) {
			settings[key] = options[key];
		}
	}

	function inVocab(ch,vocab) {
		var r = false;
		vocab.iterate(function(voc,ndx) {
			if (voc.w == ch) {
				r = true;
			}
		});
		return r;
	}

	// scan the dictionary
	var matched  = [];
	var self = this;
	this.dictionary.iterate(function(dict,n) {
		if (dict.g != 'o') {  // collecting one-syllable words
			return false;
		}
		if (settings.newWordsOnly && inVocab(dict.t,self.vocab)) { // not yet mastered
			return false;
		}
		var t = dict.t;
		var tlen = t.length;
		var cntMastered = 0;
		var cntTargeted = 0;
		for (var i=0; i<tlen; i++) {  // look at each letter in the word
			var c = t[i];
			var m = inVocab(c, self.vocab);
			if (m) {
				cntMastered++;
			}
			if (target.includes(c)) {
				cntTargeted++;	
			}
		}

		if (settings.targetGlyphsOnly) {
			if (cntTargeted == tlen) {
				matched.push(dict);
			}
		}
		else {
			if (cntMastered == tlen && cntTargeted > 0) {
				matched.push(dict);
			}
		}
	});

	if (settings.sort) {
		matched.sort(function(a,b) {
			return(a.l - b.l);
		});
	}	
	if (settings.limit) {
		matched = matched.slice(0, settings.limit);
		matched = voyc.shuffleArray(matched);
	}
	if (settings.format == 'word') {
		var words = [];
		matched.forEach(function(value,ndx,array) {
			words.push(value.t);
		}, this);
		matched = words;
	}
	return matched;
}

/**
	Find all the parts within a string
	that match a dictionary word,
	along with the parts that do not match a dictionary word.

	@input string input
	@return two-dimensional array
	[
		var identifed = [],  // array of strings, entries in Dictionary
		var unidentified = []  // array of strings, not found in Dictionary
	]

	note: could we optimize by sorting he dictionary by length descending?
*/
//voyc.parse = function(input) {
voyc.Noam.prototype.parse = function(input) {
	function sto(s, i, b) {
		if (b) {
			matched.push(s);
		}
		else {
			unmatched.push(s);
		}
	}
	var matched  = [];
	var unmatched = [];
	var s = input;
	var slen = s.length;
	var t = '';	// test string to lookup
	var tlen = t.length;
	var m = '';	// matched dict entry, array of objects
	var ui = -1;	// starting index of unmatched substring
	var us = '';	// unmatched string

	// scan input char by char. i is starting index pos.  step forward.
	//     scan consonants, continue over diacritic vowels and tone marks
	//     skip spaces " ", end word at space, wrap this whole loop after split(" ")?
	//
	for (var i=0; i<slen; i++) {

		// j is ending index pos. step backwards.
		for (var j=slen; j>i; j--) {
			t = s.substring(i,j);
			if (j < slen) {	//if (t == s) {
				// do not separate words between diacritics
				var char = s.substr(j,1); 
				var alpha = this.alphabet.lookup(char); 
				if (alpha.a.length && 'abr'.includes(alpha.a))  { 
					continue;
				}
				var nextalpha = this.alphabet.lookup(s.substr(j-1,1));
				if (nextalpha.a == 'l') {
					continue;
				}
			}
			tlen = t.length;
			m = this.dictionary.lookup(t,'t','om');  // find t in Dictionary
			if (m.length) {
				if ((ui >= 0) && (ui < i)) {
					us = s.substring(ui,i);
					sto(us, ui, false);  // save unmatched part
				}
				ui = j;
				us = m[0].t;
				sto(us, i, true);  // save matched part
				i += us.length-1;  // bump up to next start position
				break;
			}
		}
		// comment this please, wtf?
		if (j <= i) {
			if (ui < 0) {
				ui = i;
			}
		}
	}
	// unmatched piece at end
	if (ui >= 0 && i-1>ui) {
		us = s.substring(ui,i);
		if (us != s) {
			sto(us, ui, false);  // save unrecognized part
		}
	}
	
	return { match:matched, nomatch:unmatched };
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

/*
    Test Set for parseSyllable()
*/
voyc.parseSyllableTestSet = [
	{w:'กรอก',m:'กรอ',vp:'oอ',lc:'กร',fc:'ก',tm:'',tn:'L',tl:'graawk',ru:'fnsc,mcd'},
	{w:'ก๊าก',m:'ก๊า',vp:'oา',lc:'ก',fc:'ก',tm:'๊',tn:'H',tl:'gaak',ru:'fnsc,mc3'},
	{w:'กิ๊ก',m:'กิ๊',vp:'oิ',lc:'ก',fc:'ก',tm:'๊',tn:'H',tl:'gik',ru:'fnsc,mc3'},
	{w:'ครก',m:'ครก',vp:'o',lc:'คร',fc:'ก',tm:'',tn:'H',tl:'krok',ru:'ccivo,fnsc,lcds'},
	{w:'คราก',m:'ครา',vp:'oา',lc:'คร',fc:'ก',tm:'',tn:'F',tl:'kraak',ru:'fnsc,lcdl'},
	{w:'โครก',m:'โครก',vp:'โo',lc:'คร',fc:'ก',tm:'',tn:'F',tl:'krook',ru:'fnsc,lcdl'},
	{w:'กรง',m:'กรง',vp:'o',lc:'กร',fc:'ง',tm:'',tn:'M',tl:'grong',ru:'ccivo,fsc,mcl'},
	{w:'กร่าง',m:'กร่า',vp:'oา',lc:'กร',fc:'ง',tm:'่',tn:'L',tl:'graang',ru:'fsc,mc1'},
	{w:'โกร่ง',m:'โกร่',vp:'โo',lc:'กร',fc:'ง',tm:'่',tn:'L',tl:'groong',ru:'fsc,mc1'},
	{w:'แกง',m:'แกง',vp:'แo',lc:'ก',fc:'ง',tm:'',tn:'M',tl:'gaaeng',ru:'fsc,mcl'},
	{w:'งัด',m:'งั',vp:'oั',lc:'ง',fc:'ด',tm:'',tn:'H',tl:'ngat',ru:'fnsc,lcds'},
	{w:'งด',m:'งด',vp:'o',lc:'ง',fc:'ด',tm:'',tn:'H',tl:'ngot',ru:'ccivo,fnsc,lcds'},
	{w:'ผลาญ',m:'ผลา',vp:'oา',lc:'ผล',fc:'ญ',tm:'',tn:'R',tl:'plaan',ru:'fsc,hcl'},
	{w:'ชาญ',m:'ชา',vp:'oา',lc:'ช',fc:'ญ',tm:'',tn:'M',tl:'chaan',ru:'fsc,lcl'},
	{w:'ควร',m:'คว',vp:'oว',lc:'ค',fc:'ร',tm:'',tn:'M',tl:'kuan',ru:'fsc,lcl'},
	{w:'ก้าน',m:'ก้า',vp:'oา',lc:'ก',fc:'น',tm:'้',tn:'F',tl:'gaan',ru:'fsc,mc2'},
	{w:'รูป',m:'รู',vp:'oู',lc:'ร',fc:'ป',tm:'',tn:'F',tl:'ruup',ru:'fnsc,lcdl'},
	{w:'ลูบ',m:'ลู',vp:'oู',lc:'ล',fc:'บ',tm:'',tn:'F',tl:'luup',ru:'fnsc,lcdl'},
	{w:'ลาบ',m:'ลา',vp:'oา',lc:'ล',fc:'บ',tm:'',tn:'F',tl:'laap',ru:'fnsc,lcdl'},
	{w:'ลาภ',m:'ลา',vp:'oา',lc:'ล',fc:'ภ',tm:'',tn:'F',tl:'laap',ru:'fnsc,lcdl'},
	{w:'กาม',m:'กา',vp:'oา',lc:'ก',fc:'ม',tm:'',tn:'M',tl:'gaam',ru:'fsc,mcl'},
	{w:'ขม',m:'ขม',vp:'o',lc:'ข',fc:'ม',tm:'',tn:'R',tl:'kom',ru:'ccivo,fsc,hcl'},
	{w:'คม',m:'คม',vp:'o',lc:'ค',fc:'ม',tm:'',tn:'M',tl:'kom',ru:'ccivo,fsc,lcl'},
	{w:'ชม',m:'ชม',vp:'o',lc:'ช',fc:'ม',tm:'',tn:'M',tl:'chom',ru:'ccivo,fsc,lcl'},
	{w:'ชิม',m:'ชิ',vp:'oิ',lc:'ช',fc:'ม',tm:'',tn:'M',tl:'chim',ru:'fsc,lcl'},
	{w:'กาย',m:'กา',vp:'oา',lc:'ก',fc:'ย',tm:'',tn:'M',tl:'gaay',ru:'fsc,mcl'},
	{w:'ก่าย',m:'ก่า',vp:'oา',lc:'ก',fc:'ย',tm:'่',tn:'L',tl:'gaay',ru:'fsc,mc1'},
	{w:'ขาย',m:'ขา',vp:'oา',lc:'ข',fc:'ย',tm:'',tn:'R',tl:'kaay',ru:'fsc,hcl'},
	{w:'ข่า',m:'ข่า',vp:'oา',lc:'ข',fc:'',tm:'่',tn:'L',tl:'kaa',ru:'ovl,hc1'},
	{w:'แก้ว',m:'แก้',vp:'แo',lc:'ก',fc:'ว',tm:'้',tn:'F',tl:'gaaeo',ru:'fsc,mc2'},
	{w:'หวิว',m:'หวิ',vp:'oิ',lc:'หว',fc:'ว',tm:'',tn:'R',tl:'wio',ru:'cclh,fsc,hcl'},
	{w:'ไหว',m:'ไหว',vp:'ไo',lc:'หว',fc:'',tm:'',tn:'R',tl:'wai',ru:'cclh,ovl,hcl'},
	{w:'วรรค',m:'วรร',vp:'oรร',lc:'ว',fc:'ค',tm:'',tn:'H',tl:'wak',ru:'fnsc,lcds'},
	{w:'ธรรม',m:'ธรร',vp:'oรร',lc:'ธ',fc:'ม',tm:'',tn:'M',tl:'tam',ru:'fsc,lcl'},
	{w:'สรร',m:'สรร',vp:'oรร',lc:'ส',fc:'',tm:'',tn:'R',tl:'san',ru:'ovs,hcl'},
	{w:'พร',m:'พร',vp:'o',lc:'พ',fc:'ร',tm:'',tn:'M',tl:'paawn',ru:'ccivo,fsc,lcl'},
	{w:'ศร',m:'ศร',vp:'o',lc:'ศ',fc:'ร',tm:'',tn:'R',tl:'saawn',ru:'ccivo,fsc,hcl'},
];

/*
	reduplication creates multiple syllables
	examples of reduplication
			นัยนา  นัย ย นา    ย used twice, Naiyana
			วิทยาลัย  วิท ท ยาลัย
	{w:'ฉกาจ',m:'ฉกา',vp:'oา',lc:'ฉก',fc:'',tm:'',tn:'R',tl:'chkgaa',ru:'ovl,hcl'},
	{w:'พจน์',m:'พจน',vp:'o',lc:'พจน',fc:'',tm:'',tn:'H',tl:'pjno',ru:'ovs,lcds'},
	{w:'นัยนา', ru:'redup'},
	{w:'วิทยาลัย', ru:'redup'},
	{w:'ชำนาญ',m:'นา',vp:'oา',lc:'น',fc:'',tm:'',tn:'M',tl:'naa',ru:'ovl,lcl'},
	{w:'คำนวณ',m:'นว',vp:'oว',lc:'น',fc:'',tm:'',tn:'M',tl:'nua',ru:'ovl,lcl'},
*/


/*
method:	parseSyllable(syllable)
	identify these components:
		vowelpattern
		leadingconsonant
		tonemark
		finalconsonant
		tone
		translit standard
		translit custom
		rules
*/
voyc.Noam.prototype.parseSyllable = function(syllable) {
	// remove silent consonant marked with garaan
	var garaan = "์";
	var syllabl = '';
	for (var i=syllable.length-1; i>=0; i--) {
		if (syllable[i] == garaan) {
			i--;
		}
		else {
			syllabl = syllable[i] + syllabl;
		} 
	}

	// find the dictionary entry for this syllable
	var dic = this.dictionary.lookup(syllable)[0]; // used only to include id in output

	// find matching vowel pattern
	var syl = false;
	for (var k in voyc.vowelPatterns) {
		syl = false;
		var pattern = new RegExp(voyc.vowelPatterns[k].syllablePattern, 'g');
		var m = [];
		if (m = pattern.exec(syllabl)) {
			m.t = syllable;
			m.id = dic.id;
			m.k = k;
			m.m = m[0];
			m.vp = voyc.vowelPatterns[k].t;
			m.lc = m[1];
			m.tm = '';
			if (m.length > 2) {
				m.tm = m[2];
			}
			m.fc = '';
			if (m.length > 3) {
				m.fc = m[3];
			}
			m.tn = '';

			syl = m;
			break;
		}
	}
	if (!syl) return false;

	// append final consonant	
	if (syllabl.length == syl.m.length+1) {
		syl.fc = syllabl[syllabl.length-1];
	}

	// consonant cluster
	syl.ru = [];

	// use characteristics of the first consonant in the cluster
	var firstConsonant = syl.lc;
	if (syl.lc.length > 1) {
		firstConsonant = syl.lc[0];
	}
	var leadingConsonantMeta = this.alphabet.lookup(firstConsonant);

	// inherent vowel short o
	if (syl.vp == 'o' && syl.lc.length > 1) {
		syl.ru.push('ccivo');
	} 
	
	// leading h
	if (syl.lc.length > 1 && firstConsonant == 'ห') {
		syl.ru.push('cclh'); 
	}
	else if (syl.lc.length > 1 && firstConsonant == 'อ' && ['อย่า','อยู่','อย่าง','อยาก'].includes(syllable)) {
		syl.ru.push('cclha'); 
	}
	else {
		// assume final consonant
		if (syl.lc.length > 1 && !syl.fc && syl.lc[syl.lc.length-1] == syllabl[syllabl.length-1]) {
			syl.fc = syl.lc[syl.lc.length-1];
			syl.lc = syl.lc.substring(0,syl.lc.length-1);
		}
	}	

	// live or dead 
	syl.ending = '';
	var vowelMeta = voyc.vowelPatterns[syl.k];
	if (syl.fc) {
		var finalConsonantMeta = this.alphabet.lookup(syl.fc);
		if (finalConsonantMeta.a == 's')  // sonorant
			syl.ending = 'live', syl.ru.push('fsc');
		else
			syl.ending = 'dead', syl.ru.push('fnsc');
	}
	else {
		if (vowelMeta.l == 's')
			syl.ending = 'dead', syl.ru.push('ovs');
		else
			syl.ending = 'live', syl.ru.push('ovl');
	}
	// exception for openrr
	if (syl.vp == 'oรร' && syl.fc == '') {
		syl.ending = 'live'; // add -n
	}

	// tone mark
	var maiaek = '่';
	var maitoh = '้';
	var maidtree = '๊';
	var maidtawaa = '๋';
	
	// tone rules
	syl.tn = false;
	if (leadingConsonantMeta.m == 'm' && syl.tm == maiaek) syl.tn = 'L', syl.ru.push('mc1');
	else if (leadingConsonantMeta.m == 'm' && syl.tm == maitoh) syl.tn = 'F', syl.ru.push('mc2');
	else if (leadingConsonantMeta.m == 'm' && syl.tm == maidtree) syl.tn = 'H', syl.ru.push('mc3');
	else if (leadingConsonantMeta.m == 'm' && syl.tm == maidtawaa) syl.tn = 'R', syl.ru.push('mc4');
	else if (leadingConsonantMeta.m == 'm' && syl.ending == 'live') syl.tn = 'M', syl.ru.push('mcl');
	else if (leadingConsonantMeta.m == 'm' && syl.ending == 'dead') syl.tn = 'L', syl.ru.push('mcd');
	else if (leadingConsonantMeta.m == 'h' && syl.tm == maiaek) syl.tn = 'L', syl.ru.push('hc1');
	else if (leadingConsonantMeta.m == 'h' && syl.tm == maitoh) syl.tn = 'F', syl.ru.push('hc2');
	else if (leadingConsonantMeta.m == 'h' && syl.ending == 'live') syl.tn = 'R', syl.ru.push('hcl');
	else if (leadingConsonantMeta.m == 'h' && syl.ending == 'dead') syl.tn = 'L', syl.ru.push('hcd');
	else if (leadingConsonantMeta.m == 'l' && syl.tm == maiaek) syl.tn = 'F', syl.ru.push('lc1');
	else if (leadingConsonantMeta.m == 'l' && syl.tm == maitoh) syl.tn = 'H', syl.ru.push('lc2');
	else if (leadingConsonantMeta.m == 'l' && syl.ending == 'live') syl.tn = 'M', syl.ru.push('lcl');
	else if (leadingConsonantMeta.m == 'l' && syl.ending == 'dead' && vowelMeta.l == 's') syl.tn = 'H', syl.ru.push('lcds');
	else if (leadingConsonantMeta.m == 'l' && syl.ending == 'dead' && vowelMeta.l == 'l') syl.tn = 'F', syl.ru.push('lcdl');

	// tone exceptions
	if (syllable == 'ก็') syl.tn = 'F', syl.ru.push('tnex');
	if (!syl.tn) debugger;
	
	// final consonant sound
	var fs = '';
	if ('กขคฆ'.split('').includes(syl.fc)) fs = 'k';
	else if ('จฉชซฌฎฏฐฑฒดตถทธศษส'.split('').includes(syl.fc)) fs = 't';
	else if ('ปพภฟบ'.split('').includes(syl.fc)) fs = 'p';
	else if ('ง'.split('').includes(syl.fc)) fs = 'ng';
	else if ('ม'.split('').includes(syl.fc)) fs = 'm';
	else if ('นณญรลฬ'.split('').includes(syl.fc)) fs = 'n';
	else if ('ย'.split('').includes(syl.fc)) fs = 'y';
	else if ('ว'.split('').includes(syl.fc)) fs = 'o';

	// consonant cluster with leading h
	var lc = syl.lc;
	if (lc.length > 1 && (firstConsonant == 'ห' || (firstConsonant == 'อ' && ['อย่า','อยู่','อย่าง','อยาก'].includes(syllable)))) {
		lc = lc.substring(1);
	}

	// exception for openrr
	if (syl.vp == 'oรร' && syl.fc == '') {
		fs = 'n';
	} 

	// exception for final consonant ร with inherent vowel
	if (syl.vp == 'o' && syl.fc == 'ร') {
		vowelMeta = voyc.vowelPatternsLookup('oอ');
	}

	// transliteration standard
	var lce = '';
	for (var i=0; i<lc.length; i++) {
		lce += this.alphabet.lookup(lc[i]).e;
	}
	var v = vowelMeta.e;
	syl.tl = lce + v + fs;	

	// transliteration custom
	var lce = '';
	for (var i=0; i<lc.length; i++) {
		lce += voyc.translit[this.alphabet.lookup(lc[i]).e];
	}
	var v = voyc.translit[vowelMeta.e];
	syl.tlc = lce + v + voyc.translit['-'+fs];	
		
	
	return syl;
}
