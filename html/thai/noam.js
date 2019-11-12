/**
	class Noam
	singleton

	Noam, as in Noam Chomsky, famous linguist, 
	does all the linquistic and grammar analysis.

	Requires the prescence of dictionary and vocab data.

	public methods:
		collect()
		parse()
		parseWord()
**/
voyc.Noam = function(dictionary,vocab) {
	this.dictionary = dictionary;
	this.vocab = vocab;
	voyc.vowelPatternsInit();
	this.alphabet = new voyc.Alphabet(dictionary);
}

/**
	Collect a list of words that contain 
	only glyphs already mastered or working.
	@return array of words
*/
voyc.Noam.prototype.collectWords = function(target) {
	target = [] || target;
	var matched  = [];

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
	var self = this;
	this.dictionary.iterate(function(dict,n) {
		if (dict.g != 'o') {  // collecting one-syllable words
			return false;
		}
		if (inVocab(dict.t,self.vocab)) { // not yet mastered
			return false;
		}
		var t = dict.t;
		var tlen = t.length;
		var cnt = 0;
		var tcnt = 0;
		for (var i=0; i<tlen; i++) {  // look at each letter in the word
			var m = inVocab(t[i],self.vocab);
			if (m) {
				cnt++;
				if (target.includes(m.w)) {
					tcnt++;	
				}
			}
		}
		//if (cnt == tlen && tcnt > 0) {
		if (cnt == tlen) {
			matched.push(dict);
		}
	});
	return matched;
}

/**
	Collect a list of phrases that contain 
	only words already mastered or working.
	@return array of words
*/
voyc.Noam.prototype.collectPhrases = function(target) {
	target = [] || target;
	var matched  = [];

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
	var self = this;
	this.dictionary.iterate(function(dict,n) {
		if (dict.g != 'o') {  // collecting one-syllable words
			return false;
		}
		if (inVocab(dict.t,self.vocab)) { // not yet mastered
			return false;
		}
		var t = dict.t;
		var tlen = t.length;
		var cnt = 0;
		var tcnt = 0;
		for (var i=0; i<tlen; i++) {  // look at each letter in the word
			var m = inVocab(t[i],self.vocab);
			if (m) {
				cnt++;
				if (target.includes(m.w)) {
					tcnt++;	
				}
			}
		}
		//if (cnt == tlen && tcnt > 0) {
		if (cnt == tlen) {
			matched.push(dict);
		}
	});
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
*/
voyc.parse = function(input) {
	// make a copy of the dictionary, sorted by length
	var sortdict = voyc.clone(this.dictionary);

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
	for (var i=0; i<slen; i++) {

		// j is ending index pos. step backwards.
		for (var j=slen; j>i; j--) {
			t = s.substring(i,j);
			if (t == s) {
				continue;
			}
			tlen = t.length;
			m = this.dictionary.lookup(t);  // find t in Dictionary
			if (m.length) {
				if (ui >= 0) {
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
	
	return [
		matched,
		unmatched
	];
}

/* static table of rules */ voyc.ru = [
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


voyc.Noam.prototype.dev = function(msg) {
	// parse msg
	// assume msg = 'collect a,b,c,d';
	var s = '';
	switch (msg[1]) {
		case 'collect':
			var a =this.collectWords(msg[2]);
			for (var k in a) {
				s += (parseInt(k)+1)+'\t'+a[k].t+'\t'+a[k].e+'\t'+a[k].l;
			}		
	return s;
	}
}
