/**
Thai alphabet
a javascript array
generated from gdrive Thai-English Dictionary
	t:thai
	e:english transliteration
	l:length, short or long
	d:dipthong, simple or dipthong
	p:position, left, right, over, under
**/
voyc.vowelPatternsInit = function() {
	for (var k in voyc.vowelPatterns) {
		var pattern = voyc.vowelPatterns[k];
		pattern.print = pattern.t.replace(/o/g, '&#9676');

		// insert a t where the tonemark should go
		var syl = pattern.t;
		if (pattern.p.includes('o') || pattern.p.includes('u')) {
			syl = syl.replace(/o(.)/, 'o$1t');
		}
		else {
			syl = syl.replace(/o/, 'ot');
		}
		syl = syl.replace(/t/g, "([่้๊๋]?)");
		syl = syl.replace(/o/g, "([กขคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ]+)");
		pattern.syllablePattern = syl;

		//voyc.vowelPatterns[k].print = voyc.vowelPatterns[k].t.replace(/o/g, '&#9676');
		//voyc.vowelPatterns[k].process = voyc.vowelPatterns[k].t.replace(/o/g, "([กขคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ])");
		//voyc.vowelPatterns[k].process = voyc.vowelPatterns[k].process.replace(/t/g, "([่้๊๋]?)");
		//voyc.vowelPatterns[k].process = voyc.vowelPatterns[k].process.replace(/e/g, "([กขคฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ]?)");
	}
	voyc.vowelPatterns.sort(function(a,b) {
		var r = b.t.length - a.t.length;
		if (r == 0) {
			var sb = (b.p.split('').includes('l')) ? 1 : 2;
			var sa = (a.p.split('').includes('l')) ? 1 : 2;
			return sa - sb;
		}
		return r;
	});
}

voyc.vowelPatterns = [
{ t:'oะ'	,e:'a'	,l:'s'	,d:'s'	,p:'r'	},
{ t:'oา'	,e:'aa'	,l:'l'	,d:'s'	,p:'r'	},
{ t:'oั'		,e:'a'	,l:'s'	,d:'s'	,p:'o'	}, //oัo
{ t:'oิ'		,e:'i'	,l:'s'	,d:'s'	,p:'o'	},
{ t:'oี'		,e:'ii'	,l:'l'	,d:'s'	,p:'o'	},
{ t:'oึ'		,e:'ʉ'	,l:'s'	,d:'s'	,p:'o'	},
{ t:'oื'		,e:'ʉʉ'	,l:'l'	,d:'s'	,p:'o'	},
{ t:'oือ'	,e:'ʉʉ'	,l:'l'	,d:'s'	,p:'o'	},
{ t:'oุ'		,e:'u'	,l:'s'	,d:'s'	,p:'u'	},
{ t:'oู'		,e:'uu'	,l:'l'	,d:'s'	,p:'u'	},
{ t:'โoะ'	,e:'o'	,l:'s'	,d:'s'	,p:'l'	},
{ t:'โo'	,e:'oo'	,l:'l'	,d:'s'	,p:'l'	},
{ t:'o'		,e:'o'	,l:'s'	,d:'s'	,p:'d'	},  // oo
{ t:'เoะ'	,e:'e'	,l:'s'	,d:'s'	,p:'lr'	},
{ t:'เo'	,e:'e'	,l:'l'	,d:'s'	,p:'l'	},
{ t:'เo็'	,e:'e'	,l:'s'	,d:'s'	,p:'lo'	},  //เo็o
{ t:'แoะ'	,e:'ae'	,l:'s'	,d:'s'	,p:'lr'	},
{ t:'แo'	,e:'aae',l:'l'	,d:'s'	,p:'l'	},
{ t:'แo็'	,e:'ae'	,l:'s'	,d:'s'	,p:'lo'	},  //แo็o 
{ t:'เoาะ'	,e:'aw'	,l:'s'	,d:'s'	,p:'lrr'},
{ t:'oอ'	,e:'aaw',l:'l'	,d:'s'	,p:'r'	},
{ t:'o็'		,e:'aaw',l:'l'	,d:'s'	,p:'o'	},
{ t:'เoอะ'	,e:'ö'	,l:'s'	,d:'s'	,p:'lrr'},
{ t:'เoอ'	,e:'öö'	,l:'l'	,d:'s'	,p:'lr'	},
{ t:'เoิ'	,e:'ö'	,l:'s'	,d:'s'	,p:'lo'	},
{ t:'เoีย'	,e:'ia'	,l:'l'	,d:'d'	,p:'lor'},
{ t:'เoือ'	,e:'ʉʉa',l:'l'	,d:'d'	,p:'lor'},
{ t:'oัวะ'	,e:'ua'	,l:'s'	,d:'d'	,p:'orr'},
{ t:'oัว'	,e:'ua'	,l:'l'	,d:'d'	,p:'or'	},
{ t:'oว'	,e:'ua'	,l:'l'	,d:'d'	,p:'r'	},  // oวo 
{ t:'ไo'	,e:'ai'	,l:'l'	,d:'d'	,p:'l'	},
{ t:'ใo'	,e:'ai'	,l:'l'	,d:'d'	,p:'l'	},
{ t:'เoา'	,e:'ao'	,l:'l'	,d:'d'	,p:'lr'	},
{ t:'oำ'	,e:'am'	,l:'l'	,d:'d'	,p:'r'	},
{ t:'เoย'	,e:'öi'	,l:'l'	,d:'d'	,p:'lr'	},
];
