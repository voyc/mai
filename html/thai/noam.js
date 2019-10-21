/**
	class Noam
	singleton

	Noam, as in Noam Chomsky, famous linguist, 
	does all the linquistic and grammar analysis.
**/
voyc.Noam = function(dictionary,vocab) {
	this.dictionary = dictionary;
	this.vocab = vocab;
}

/**
	Collect a list of words using a subset of the alphabet.
	
	public static function voyc.collect(input)
		@return array

	Requires presence of Dictionary.
*/
voyc.Noam.prototype.collect = function() {
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
		if (dict.g == 'g') {
			return;
		}
		var t = dict.t;
		var tlen = t.length;
		var cnt = 0;
		var wcnt = 0;
		for (var i=0; i<tlen; i++) {
			var m = inVocab(t[i],self.vocab);
			if (m) {
				cnt++;
				if (m.s == 'w' || m.s == 'm') {
					wcnt++;	
				}
			}
		}
		if (cnt == tlen && wcnt > 0) {
			matched.push(dict);
		}
	});
	return matched;
}
