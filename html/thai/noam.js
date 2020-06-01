/**
	class Noam
	singleton

	Noam, as in Noam Chomsky, famous linguist, 
	does all the linquistic and grammar analysis.

	public methods:
		collectWords()
		parseStory()
		parseString()
		parseSyllable()
**/
voyc.Noam = function(dictionary,vocab) {
	voyc.vowelPatternsInit();
}

/*
voyc.Noam.prototype.eliminateDupes = function(a) {
	//a.sort();
	var b = [];
	var prev = '';
	a.forEach(function(i) {
		if (i != prev) {
			b.push(i);
		}
		prev = i;
	}, this);
	//b = voyc.shuffleArray(b);
	return b;
}
*/

/*
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
				bVocab = voyc.vocab.get(g);
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
			var d = voyc.dictionary.search(g)[0];
			dict.push[d];
		}, this);
		glyph = dict;
	}
	return glyph;
}
*/

/*
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
				var d = voyc.vocab.get(w);
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
			var d = voyc.dictionary.search(w)[0];
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
*/

/*
voyc.Noam.prototype.analyzeWord = function(word) {
	var wordEng = [];
	word.forEach(function(w) {
		wordEng.push(voyc.dictionary.translate(w));
	}, this);

	dictOld = [];
	dictNew = [];
	wordErr = [];
	word.forEach(function(w) {
		var d = voyc.dictionary.search(w)[0];
		if (!d) {
			wordErr.push(w);
		}
		else {
			var v = voyc.vocab.get(w);
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
*/

/*
// analyze phrases assuming a space between words
voyc.Noam.prototype.analyzeStory = function(story) {
	var word = [];
	var wordEng = [];
	var phraseEng = [];
	story.forEach(function(phrase) {
		phraseEng.push(voyc.dictionary.translate(phrase));
		var words = phrase.split(' ');
		words.forEach(function(w) {
			word.push(w);
			wordEng.push(voyc.dictionary.translate(w));
		}, this);

	}, this);

	word = this.eliminateDupes(word);

	dictOld = [];
	dictNew = [];
	wordErr = [];
	word.forEach(function(w) {
		var d = voyc.dictionary.search(w)[0];
		if (!d) {
			wordErr.push(w);
		}
		else {
			var v = voyc.vocab.get(w);
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
*/

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
	voyc.dictionary.iterate(function(dict,n) {
		if (dict.g != 'o') {  // collecting one-syllable words
			return false;
		}
		if (settings.newWordsOnly && inVocab(dict.t,voyc.vocab)) { // not yet mastered
			return false;
		}
		var t = dict.t;
		var tlen = t.length;
		var cntMastered = 0;
		var cntTargeted = 0;
		for (var i=0; i<tlen; i++) {  // look at each letter in the word
			var c = t[i];
			var m = inVocab(c, voyc.vocab);
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
	method parseStory
	input/output: story object
**/
voyc.Noam.prototype.parseStory = function(story) {
	var s = story.original;

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

	// identify speakers, remove speaker definition lines
	// (key:: name,age,gender)
	for (var i=0; i<a.length; i++) {
		var s = a[i].split(':: ');
		if (s.length > 1) {
			var o = {};
			var key = s[0];
			var b = s[1].split(',');
			o.name = b[0];
			o.age = parseInt(b[1]);
			o.gender = b[2].substr(0,1);
			story.speakers[key] = o; 
			a.splice(i,1);
			i--;
		}
	}

	// identify meta comment lines
	for (var i=0; i<a.length; i++) {
		if (a[i].substr(0,6) == 'meta::') {
			if (story.meta.length) {
				story.meta += '<br/>';
			}
			story.meta += a[i].substr(6);
			a.splice(i,1);
			i--;
		}
	}
	
	// create one object for each line of dialog
	for (var i=0; i<a.length; i++) {
		var o = {};
		o.original = a[i];
		o.speaker = assignSpeaker(o.original);
		var aorig = o.original.split(/\s~\s/);
		o.th = assignText(aorig[0]); // previously o.text
		if (aorig.length > 1) {
			o.en = assignText(aorig[1]);
		}
		o.speech = prepSpeech(o.th);
		o.display = prepDisplay(o);
		story.lines.push(o);
	}

	// parse each line for words
	for (var i=0; i<story.lines.length; i++) {
		var line = story.lines[i].th;
		story.lines[i].words = this.parseString(line, i+1, true);
	}

	// reconcile new story.lines.words with old story.words
	if (story.words) {
		// if the number of lines has changed, bugger all
		
		
		
		for (var i=0; i<story.words.length; i++) {
			var w = story.words[i];
			for (var j=0; j<w.loc.length; j++) {
				var wloc = w.loc[j];
				var word = findLoc(wloc);
				if (word) {
					word.loc[0].n = wloc.n;
				}
			}
		}
	}

	// consolidate words from newly parsed lines/words
	//story.words = story.consolidateWords(); // moved to story

	// set title
	story.title = story.lines[0].th+' ~ '+story.lines[0].en;
	return;

	function findLoc(wloc) {
		var found = false;
		var line = story.lines[wloc.line-1];
		for (var i=0; i<line.words.length; i++) {
			var word = line.words[i];
			if (word.loc[0].tndx == wloc.tndx) {
				found = word;
			}
		}
		return found;
	}

	function assignSpeaker(orig) {
		var key = 'x';
		var c = orig.split(':');
		if (c.length > 1) {
			key = c[0];
		}
		return key;
	}

	function assignText(orig) {
		var th = orig;
		var c = orig.split(': ');
		if (c.length > 1) {
			th = c[1];
		}
		//gen.th = orig.replace(/me/g, gender.me);
		//gen.th = orig.replace(/polite/g, gender.polite);
		return th;
	}

	function prepSpeech(th) {
		var sp = th;
		sp = sp.replace(/ /g, '. ');
		return sp;
	}

	function prepDisplay(o) {
		var disp = '';
		if (o.speaker != 'x') {
			disp = o.speaker + ': ' + o.th;
		}
		return disp;
	}
}

/**
	method parseString
	Find all the parts within a string that match a dictionary word,
	along with the parts that do not match a dictionary word.

	@input string input
	@return array of objects
**/
voyc.Noam.prototype.parseString = function(input, linenum, greedy) {
	var greedy = greedy || false;
	var words = [];

	// split the input into multiple substrings separated by whitespace 
	//var sa = input.split(/\s+/); 
	//var sa = input.replace(/[\(\)\"\!]/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g,' ').trim().split(' ');

	// split string on spaces and non-thai chars
	var fstr = input.replace(/[\ \(\)\"\!i\-\.\,\'\%\&\*\$\#\@\:\;A-Za-z0-9]+/g, function ($1) { return '~' + $1 + '~';});
	if (fstr.substr(fstr.length-1,1) == '~')
		fstr = fstr.substr(0,fstr.length-1);
	var sa = fstr.split('~');

	for (var n=0; n<sa.length; n++) {
		var fullStringMatch = {};
		var s = sa[n];
		var slen = s.length;
		var us = '';	// unmatched string
		var ui = -1;	// starting index of unmatched substring
		var startndx = input.indexOf(s);

		// if pass-through, sto it and continue
		var test = s.substr(0,1);
		if (!voyc.alphabet.search(s.substr(0,1))) {
			sto(s,n,startndx,0,'',false);
			continue;
		}

		// scan input char by char. i is starting index pos.  step forward.
		for (var i=0; i<slen; i++) {

			// j is ending index pos. step backwards.
			for (var j=slen; j>i; j--) {
				var t = s.substring(i,j);
				if (j < slen) {	//if (t == s) 
					// do not separate words between diacritics
					var char = s.substr(j,1); 
					var alpha = voyc.alphabet.search(char); 
					if (!alpha) {
						console.log('character '+char+' not in dictionary');
						debugger;
					}
					if (alpha.a.length && 'abr'.includes(alpha.a))  { 
						continue;
					}
					var nextalpha = voyc.alphabet.search(s.substr(j-1,1));
					if (nextalpha.a == 'l') {
						continue;
					}
				}
				//var m = voyc.dictionary.search(t,'t','om');  // find t in Dictionary
				var m = voyc.dictionary.fastMatch(t);  // find t in Dictionary
				if (m) {
					if (t == s && !greedy) {
						// save for optional later use
						fullStringMatch = {
							t:t,
							line:linenum,
							ndx:startndx,
							id:m.id,
							tl:m.tl,
							vocab:voyc.vocab.get(t)
						};
						continue;
					}
					if ((ui >= 0) && (ui < i)) {
						us = s.substring(ui,i);
						sto(us, linenum, startndx+ui, 0, '', false);  // save unmatched part
					}
					ui = j;
					us = m.t;
					var v = voyc.vocab.get(us);
					sto(us, linenum, startndx+i, m.id, m.tl, v);  // save matched part
					i += us.length-1;  // bump up to next start position
					break;
				}
			}
			// first time, mark the beginning of an unmatched string
			if (j <= i) {
				if (ui < 0) {
					ui = i;
				}
			}
		}

		// unmatched piece at end, or full string match
		if (ui >= 0 && i-1>=ui) {
			us = s.substring(ui,i);
			if (us == s && fullStringMatch.t) {
				if (us != fullStringMatch.t)
					debugger;
				var fsm = fullStringMatch;
				sto(fsm.t, fsm.line, fsm.ndx, fsm.id, fsm.tl, fsm.vocab);  // save full string match
			}
			else {
				sto(us, linenum, startndx+ui, 0, '', false);  // save unrecognized part
			}
		}
	}
	return words;

	function sto(t, line, ndx, id, tl, vocab) {
		var o = {
			t:t,
			id:id,
			tl:tl,
			comp:0,
			loc:[{line:line,wndx:words.length,tndx:ndx,n:0}],
			vocab:vocab
		};
		words.push(o);
	}
}

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
	var syl = {};

	// remove silent consonant marked with garaan
	var garaan = "์";
	var syllabl = '';
	syl.silent = '';
	for (var i=syllable.length-1; i>=0; i--) {
		if (syllable[i] == garaan) {
			syl.silent = syllable[i] + syl.silent;
			i--;
			syl.silent = syllable[i] + syl.silent;
		}
		else {
			syllabl = syllable[i] + syllabl;
		} 
	}

	// find the dictionary entry for this syllable
	//var dic = voyc.dictionary.search(syllable)[0]; // used only to include id in output

	// find matching vowel pattern
	for (var k in voyc.vowelPatterns) {
		var pattern = new RegExp(voyc.vowelPatterns[k].syllablePattern, 'g');
		var m = [];
		if (m = pattern.exec(syllabl)) {
			syl.t = syllable;
		//	syl.id = dic.id;
			syl.k = k;
			syl.m = m[0];
			syl.vp = voyc.vowelPatterns[k].t;
			syl.lc = m[1];
			syl.tm = '';
			if (m.length > 2) {
				syl.tm = m[2];
			}
			syl.fc = '';
			if (m.length > 3) {
				syl.fc = m[3];
			}
			syl.tn = '';
			break;
		}
	}
	if (!m) return false;

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
	var leadingConsonantMeta = voyc.alphabet.search(firstConsonant);

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
		var finalConsonantMeta = voyc.alphabet.search(syl.fc);
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
		lce += voyc.alphabet.search(lc[i]).e;
	}
	var v = vowelMeta.e;
	syl.tl = lce + v + fs + syl.tn;	

	// transliteration custom
	var lce = '';
	for (var i=0; i<lc.length; i++) {
		lce += voyc.translit[voyc.alphabet.search(lc[i]).e];
	}
	var v = voyc.translit[vowelMeta.e];
	syl.tlc = lce + v + voyc.translit['-'+fs] + syl.tn;

	syl.cp = voyc.dictionary.joinComponents(syl);
	return syl;
}

/**
	move to utils.js
**/
voyc.countObject = function(object) {
	var length = 0;
	for( var key in object ) {
		if( object.hasOwnProperty(key) ) {
			++length;
		}
	}
	return length;
}

