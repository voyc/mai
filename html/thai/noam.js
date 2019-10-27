/**
	class Noam
	singleton

	Noam, as in Noam Chomsky, famous linguist, 
	does all the linquistic and grammar analysis.

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
voyc.Noam.prototype.collect = function(target) {
	var matched  = [];

	function inVocab(ch,vocab) {
		var r = false;
		for (var i=0; i<vocab.length; i++) {
			var v = vocab[i];
			if (v.w == ch) {
				r = v;
				break;
			}
		}
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
		if (cnt == tlen && tcnt > 0) {
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

/**
	Parse a word into syllables.
	
	public static function voyc.parseWord(input)
		@return array

		return: tone, one of five: L,M,H,R,F

		test cases
			ไก่	L	ok
			แดน	M	ok
			ใด	M	ok
			ทน	M	ok, default vowel closed
			ทวีป	HF	error, is M, default vowel open not detected
			ทำไม	MM	ok
			นี่	F	ok
			ที่นี่	FF	ok
			นม	M	ok
			นวด	F	ok
			แน่	F	ok
			ปวด	L	ok
			ปาก	L	error, is M, finalConsonant not detected
			ปี	M	ok
			แปด	L	ok
			ไม่	F	ok

		todo
			count trailing orphan glyphs
			look at orphan glyphs
			if consonant, try to add to previous syllable as finalConsonant
			if cannot, try to make default vowel open

		note: parseWord() need only be done once for each word
			then it is added to dictionary and components tables

		parse() on the other hand, will be run repeatedly 
			on every sentence that is not in the phrase book

		new tables:
			components - non-unique key: dictionary, phrasebook
				alphabet, rules, words, grammars
			phrase book - like dictionary, maybe part of dictionary
			rules - shortname to longname
*/
voyc.Noam.prototype.parseWord = function(input, returnDetails) {
	returnDetails = returnDetails || false;
	var word = input;

	// find matching pattern for input word
	var numMatches = 0;
	var matchedPatterns = [];
	for (var k in voyc.vowelPatterns) {
		var pattern = new RegExp(voyc.vowelPatterns[k].syllablePattern, 'g');
		var cnt = 0;
		var m = [];
		// for global pattern, must exec repeatedly, once for each match

		while (m = pattern.exec(word)) {
			m.patternIndex = k;
			m.string = m[0];
			m.vowel = voyc.vowelPatterns[k].print;
			m.leadingConsonant = m[1];
			m.toneMark = m[2];
			if (m.length > 3) {
				m.finalConsonant = m[3];
			}

			//m.leadingConsonant = voyc.alphabet.lookup(m[1])[0];
			//m.finalConsonant = voyc.alphabet.lookup(m[3])[0];
			//m.tonemark = voyc.alphabet.lookup(m[2])[0];

			m.begin = m.index;
			m.end = m.index + m.string.length; // up to but not including
			matchedPatterns.push(m);
			cnt++;
			if (cnt > 50) {
				break;  // stop runaway loop
			}
		}
	}
	var numMatches = matchedPatterns.length;
	if (!numMatches) {
		return {tone:'', num:0, syllables:0};
	}

	// sort matched patterns by index and length, both ascending
	matchedPatterns.sort(function(a,b) {
		var x = a.index - b.index;
		if (x == 0) {
			(a.end - a.begin) - (b.end - b.begin);
		}
		return x;
	});

	// assemble possible chains of syllables
	function addSyllableToChain(chain, syllable) {
		chain.orphans.push({begin:chain.end, end:syllable.begin});
		chain.numOrphanGlyphs += syllable.begin - chain.end;
		chain.syllables.push(syllable);
		chain.end = syllable.end;
	}

	function isOverlap(chain, syllable) {
		return (syllable.begin < chain.end);
	}

	var chains = [];
	for (var k in matchedPatterns) {
		var syllable = matchedPatterns[k];
		var chained = false;

		// add the syllable to each chain where it fits
		for (var c in chains) {
			chain = chains[c];
			if (!isOverlap(chain, syllable)) {
				addSyllableToChain(chain, syllable);
				chained = true;
			}
		}

		// if it did not fit on any chain, create a new chain and add it there
		if (!chained) {
			var chain = {
				syllables:[],
				orphans:[],
				numOrphanGlyphs:0,
				end:0
			};
			addSyllableToChain(chain, syllable);
			chains.push(chain);
		}
	}

	// add trailing orphans
	for (var c in chains) {
		chain = chains[c];
		if (chain.end < word.length) {
			chain.orphans.push({begin:chain.end, end:word.length});
			chain.numOrphanGlyphs += word.length - chain.end;
			chain.end = word.length;
		}
	}

	// convert orphaned consonant to finalConsonant or defaultVowelOpen
//	for (var c in chains) {
//		chain = chains[c];
//		if (chain.end < word.length) {
//			chain.orphans.push({begin:chain.end, end:word.length});
//			chain.numOrphanGlyphs += word.length - chain.end;
//			chain.end = word.length;
//		}
//	}

/*
	other rules
		vowel dipthong: ai, ao, etc
		consonant cluster, not labeled as dipthong

		final consonant
			six ending sounds:
				live  /-n/, /-ng/, or /-m/
				dead  /-k/, /-p/, or /-t/

		reduplication
			a single consonant is used twice, as the 
				end of the previous syllable, and 
				beginning of the next
			นัยนา  นัย ย นา    ย used twice, Naiyana
			วิทยาลัย  วิท ท ยาลัย

		initial consonant cluster
			true consonant cluster { ก, ข, ค, ต, ป, ผ, พ } + { ร, ล, ว }
			false consonant cluster  { จ, ซ, ท, ส, ศ } + silent ร
			leading consonant clusters  neither true nor false 
				including clusters with leading ห or อ
				including enepenthetic initial consonant cluster
					short-a inserted between incompatible adjacent consonants

		inherent vowel
			short o invoked between initial and final consonant
			short a invoked with one standalone single consonant
			short a in enepenthetic cluster described above
*/

	// choose the chain with the lowest number of orphans
 	var winnerIndex = -1;
	var winnerNumOrphanGlyphs = 100;
	for (var c in chains) {
		chain = chains[c];
		if (chain.numOrphanGlyphs < winnerNumOrphanGlyphs) {
			winnerNumOrphanGlyphs = chain.numOrphanGlyphs;
			winnerIndex = c;
		}
	}
	var winner = chains[c];
	var numSyllables = winner.syllables.length;
	return {tone:tone, num:numSyllables, syllables:winner.syllables};

	
	// Actually, there should be one and only one syllable with 0 orphans.
	// If not, developer intervention is required.
	if (winner.numOrphanGlyphs != 0) {
		console.log( [winner.syllables[0].input, "orphans", winner.numOrphanGlyphs]);
	}

	// analyze each syllable
	var tone = '';
	for (var s in winner.syllables) {
		var syl = winner.syllables[s];
		syl.rules = [];
		syl.ending = '';
		if (syl.finalConsonant) {
			var finalConsonantMeta = voyc.alphabet.lookup(syl.finalConsonant)[0];
			if (finalConsonantMeta.a == 's')  // sonorant
				syl.ending = 'live', syl.rules.push('final sonorant consonant: live');
			else
				syl.ending = 'dead', syl.rules.push('final non-sonorant consonant: dead');
		}
		else {
			var vowelMeta = voyc.vowelPatterns[syl.patternIndex];
			if (vowelMeta.l == 's')
				syl.ending = 'dead', syl.rules.push('open vowel short: dead');
			else
				syl.ending = 'live', syl.rules.push('open vowel long: live');
		}

		// apply tone rules
		syl.tn = false;
		var maiaek = '่';
		var maitoh = '้';
		var maidtree = '๊';
		var maidtawaa = '๋';
		var leadingConsonantMeta = voyc.alphabet.lookup(syl.leadingConsonant)[0];
		var vowelMeta = voyc.vowelPatterns[syl.patternIndex];
		if (leadingConsonantMeta.m == 'm' && syl.ending == 'live') syl.tn = 'M', syl.rules.push('mid-class live: M');
		if (leadingConsonantMeta.m == 'm' && syl.ending == 'dead') syl.tn = 'L', syl.rules.push('mid-class dead: L');
		if (leadingConsonantMeta.m == 'm' && syl.tm == maiaek) syl.tn = 'L', syl.rules.push('mid-class mai eak: L');
		if (leadingConsonantMeta.m == 'm' && syl.tm == maitoh) syl.tn = 'F', syl.rules.push('mid-class mai toh: F');
		if (leadingConsonantMeta.m == 'h' && syl.ending == 'live') syl.tn = 'R', syl.rules.push('high-class live: R');
		if (leadingConsonantMeta.m == 'h' && syl.ending == 'dead') syl.tn = 'L', syl.rules.push('high-class dead: L');
		if (leadingConsonantMeta.m == 'h' && syl.tm == maiaek) syl.tn = 'L', syl.rules.push('high-class mai eak: L');
		if (leadingConsonantMeta.m == 'h' && syl.tm == maitoh) syl.tn = 'F', syl.rules.push('high-class mai toh: F');
		if (leadingConsonantMeta.m == 'l' && syl.ending == 'live') syl.tn = 'M', syl.rules.push('low-class live: M');
		if (leadingConsonantMeta.m == 'l' && syl.ending == 'dead' && vowelMeta.l == 's') syl.tn = 'H', syl.rules.push('low-class dead short: H');
		if (leadingConsonantMeta.m == 'l' && syl.ending == 'dead' && vowelMeta.l == 'l') syl.tn = 'F', syl.rules.push('low-class dead long: F');
		if (leadingConsonantMeta.m == 'l' && syl.tm == maiaek) syl.tn = 'F', syl.rules.push('low-class mai eak: F');
		if (leadingConsonantMeta.m == 'l' && syl.tm == maitoh) syl.tn = 'H', syl.rules.push('low-class mai toh: H');
		if (!syl.tn) 
			debugger;

		tone += syl.tn;
	}

	return {tone:tone, syllables:winner.syllables};
}

/*
	other rules
		vowel dipthong: ai, ao, etc
		consonant cluster, not labeled as dipthong

		final consonant
			six ending sounds:
				live  /-n/, /-ng/, or /-m/
				dead  /-k/, /-p/, or /-t/

		reduplication
			a single consonant is used twice, as the 
				end of the previous syllable, and 
				beginning of the next
			นัยนา  นัย ย นา    ย used twice, Naiyana
			วิทยาลัย  วิท ท ยาลัย

		initial consonant cluster
			true consonant cluster { ก, ข, ค, ต, ป, ผ, พ } + { ร, ล, ว }
			false consonant cluster  { จ, ซ, ท, ส, ศ } + silent ร
			leading consonant clusters  neither true nor false 
				including clusters with leading ห or อ
				including enepenthetic initial consonant cluster
					short-a inserted between incompatible adjacent consonants

		inherent vowel
			short o invoked between initial and final consonant
			short a invoked with one standalone single consonant
			short a in enepenthetic cluster described above
*/
voyc.Noam.prototype.parseSyllable = function(input, returnDetails) {
	returnDetails = returnDetails || false;
	var word = input;
	
	// find matching pattern for input word
	var numMatches = 0;
	var matchedPatterns = [];
	for (var k in voyc.vowelPatterns) {
		var pattern = new RegExp(voyc.vowelPatterns[k].syllablePattern, 'g');
		var cnt = 0;
		var m = [];
		if (m = pattern.exec(word)) {
			m.t = word;
			m.i = k;
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

			matchedPatterns.push(m);
			cnt++;
			if (cnt > 50) {
				break;  // stop runaway loop
			}
		}
	}
	var numMatches = matchedPatterns.length;
	if (!numMatches) {
		return false;
	}

	// sort matched patterns length of the match descending
	matchedPatterns.sort(function(a,b) {
		return (b.m.length - a.m.length);
	});


	// choose the longest match
	var syl = matchedPatterns[0];
	
	syl.status = 0;
	var lenMatch = syl.m.length;
	var lenWord = word.length;
	if (lenWord == lenMatch) {
		syl.status = 1
	}
	if (lenWord == lenMatch+1) {
		syl.fc = word[lenWord-1];
		syl.status = 1;
	}

	// apply tone rules
	var tone = '';
	syl.rules = [];
	syl.ending = '';
	if (syl.fc) {
		var finalConsonantMeta = this.alphabet.lookup(syl.fc);
		if (finalConsonantMeta.a == 's')  // sonorant
			syl.ending = 'live', syl.rules.push('final sonorant consonant: live');
		else
			syl.ending = 'dead', syl.rules.push('final non-sonorant consonant: dead');
	}
	else {
		var vowelMeta = voyc.vowelPatterns[syl.i];
		if (vowelMeta.l == 's')
			syl.ending = 'dead', syl.rules.push('open vowel short: dead');
		else
			syl.ending = 'live', syl.rules.push('open vowel long: live');
	}

	// apply tone rules
	syl.tn = false;
	var maiaek = '่';
	var maitoh = '้';
	var maidtree = '๊';
	var maidtawaa = '๋';

	var firstConsonant = syl.lc;
	if (syl.lc.length > 1) {
		syl.rules.push('consonant cluster');
		firstConsonant = syl.lc[0];
	}
	var leadingConsonantMeta = this.alphabet.lookup(firstConsonant);
	var vowelMeta = voyc.vowelPatterns[syl.i];
	if (leadingConsonantMeta.m == 'm' && syl.ending == 'live') syl.tn = 'M', syl.rules.push('mid-class live: M');
	if (leadingConsonantMeta.m == 'm' && syl.ending == 'dead') syl.tn = 'L', syl.rules.push('mid-class dead: L');
	if (leadingConsonantMeta.m == 'm' && syl.tm == maiaek) syl.tn = 'L', syl.rules.push('mid-class mai eak: L');
	if (leadingConsonantMeta.m == 'm' && syl.tm == maitoh) syl.tn = 'F', syl.rules.push('mid-class mai toh: F');
	if (leadingConsonantMeta.m == 'h' && syl.ending == 'live') syl.tn = 'R', syl.rules.push('high-class live: R');
	if (leadingConsonantMeta.m == 'h' && syl.ending == 'dead') syl.tn = 'L', syl.rules.push('high-class dead: L');
	if (leadingConsonantMeta.m == 'h' && syl.tm == maiaek) syl.tn = 'L', syl.rules.push('high-class mai eak: L');
	if (leadingConsonantMeta.m == 'h' && syl.tm == maitoh) syl.tn = 'F', syl.rules.push('high-class mai toh: F');
	if (leadingConsonantMeta.m == 'l' && syl.ending == 'live') syl.tn = 'M', syl.rules.push('low-class live: M');
	if (leadingConsonantMeta.m == 'l' && syl.ending == 'dead' && vowelMeta.l == 's') syl.tn = 'H', syl.rules.push('low-class dead short: H');
	if (leadingConsonantMeta.m == 'l' && syl.ending == 'dead' && vowelMeta.l == 'l') syl.tn = 'F', syl.rules.push('low-class dead long: F');
	if (leadingConsonantMeta.m == 'l' && syl.tm == maiaek) syl.tn = 'F', syl.rules.push('low-class mai eak: F');
	if (leadingConsonantMeta.m == 'l' && syl.tm == maitoh) syl.tn = 'H', syl.rules.push('low-class mai toh: H');
	if (!syl.tn) 
		debugger;

	// compose transliteration
	var lc = '';
	for (var i=0; i<syl.lc.length; i++) {
		lc += this.alphabet.lookup(syl.lc[i]).e;
	}
	var v = vowelMeta.e;
	var fc = this.alphabet.lookup(syl.fc).e || '';
	syl.tl = lc + v + fc;	

	return syl;
}
