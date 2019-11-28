/**
**/
voyc.Lesson = function(vocab) {
	this.vocab = vocab;  // each lesson state is stored in vocab
	this.list = voyc.lessons; // static array of lessons
	this.current = false;   // a copy of the current lesson object, saved in localStorage
	this.settings = {
		firstLessonId: this.list[0].id,
		lastLessonId: this.list[this.list.length-1].id,
	};
}

voyc.Lesson.prototype.retrieve = function() {
	var ls = localStorage.getItem('lesson');
	if (ls) {
		this.current = JSON.parse(ls);
	}
}

voyc.Lesson.prototype.store = function() {
	localStorage.setItem('lesson', JSON.stringify(this.current));
}

voyc.Lesson.prototype.getName = function() {
	return this.current.section + ':' + this.current.name;
}

voyc.Lesson.prototype.loadPreviousLessonInProgress = function() {
	// get previous lesson object from localStorage if it exists
	this.retrieve();

	// if not, recreate lesson object from vocab
	if (!this.current) {
		var prev = {w:this.settings.firstLessonId, s:-1, r:0};
		this.vocab.iterate(function(voc) {
			if (voc.t == 'l' && voc.r > prev.r) {
				prev = {w:voc.w, r:voc.r, s:voc.s};
			}
		});
		this.current = voyc.clone(this.getLessonFromId(prev.w));
		this.current.phasen = prev.s;

		// write to localStorage
		this.store();
	}
}

voyc.Lesson.prototype.getLessonFromId = function(id) {
	var lesson = false;
	for (var i=0; i<this.list.length; i++) {
		lesson = this.list[i];
		if (lesson.id == id) {
			break;
		}
	}
	return lesson;
}

voyc.Lesson.prototype.currentNdx = function() {
	var ndx = false;
	for (var i=0; i<this.list.length; i++) {
		var lesson = this.list[i];
		if (lesson.id == this.current.id) {
			ndx = i;
			break;
		}
	}
	return ndx;
}

voyc.Lesson.prototype.next = function() {
	var lesson = false;
	var ndx = this.currentNdx();
	ndx++;
	if (ndx < this.list.length) {
		lesson = this.list[ndx];
	}
	this.current = lesson;
	return lesson;
}

voyc.Lesson.prototype.isLessonFinished = function() {
	return (this.current.phasen == 'm');
}

voyc.Lesson.prototype.isLastLesson = function() {
	return (this.currentNdx() >= this.list.length-1);
}

voyc.lessons = [
	{
		id:'kh',
		section: 'Keyboard',
		name: 'Home Keys',
		sequence: 1,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize: 3,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
		phasen: 0,
		glyph: ['ด','่','ก','า','ห','ส','ฟ','ว'],
		word:[],
		phrase:[],
	},{
		id:'ki',
		section: 'Keyboard',
		name: 'Index and Middle Finger',
		sequence: 2,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:3,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
		phasen: 0,
		glyph: ['พ','ี','อ','ท','ำ','ร','แ','ม'],
		word:[],
		phrase:[],
	},{
		id:'krp',
		section: 'Keyboard',
		name: 'Ring Finger and Pinkie',
		sequence: 4,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:3,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
		phasen: 0,
		glyph: ['ไ','น','ป','ใ','ๆ','ย','ผ','ฝ'],
		word:[],
		phrase:[],
	},{
		id:'kic',
		section: 'Keyboard',
		name: 'Index Finger Center',
		sequence: 6,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
		phasen: 0,
		glyph: ['เ','้','ะ','ั','ิ','ื'],
		word:[],
		phrase:[],
	},{
		id:'kpr',
		section: 'Keyboard',
		name: 'Pinkie Reach',
		sequence: 7,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
		phasen: 0,
		glyph: ['ง','บ','ล'],
		word:[],
		phrase:[],
	},{
		id:'khr',
		section: 'Keyboard',
		name: 'High Right',
		sequence: 8,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
		phasen: 0,
		glyph: ['ุ','ึ','ค','ต','จ','ข','ช'],
		word:[],
		phrase:[],
	}
];

/*
user profile must contain a list of lessons that have been completed
or, can vocab contain lessons in work or mastered

section/name  state

*/

/*
ด่กาหสฟว 1    home keys
พีอท     2   index finger
ำรแม    3    middle finger
ไนปใ    4    ring finger
ๆยผฝ    5    pinkie
เ้ะัิื      6     index finger center
งบล     7     pinkie reach
 ุ ึคตจขช  8   high right

ภถๅ  9     high left
โ๋ฏษฆศฤซ    shift home keys
ฑ๊ฮ?        shift index finger
ฎณฉฒ        shift middle finger
"ฯ)ฬ           shift ring finger
๐ญ(ฦ          shift pinkie
ฌ็ธํฺ์             shift center
.ฐ,        shift pinkie reach
ู฿             shift high index finger
๑๒๓๔๕๖๗๘๙    shift digits


()ฺ.,"%+    punctuation
_/-         shift punctuation

ๆฯ               symbols
฿               shift symbols
*/
