/**
**/
voyc.Lessons = function(vocab) {
	this.vocab = vocab;
	this.lessons = voyc.lessons;
	this.lessonid = '';
	this.phasendx = -1;
	this.lesson = null;
}

voyc.Lessons.prototype.setup = function() {
	// get most recent lesson state
	var highm = '';
	var loww = '';
	this.vocab.iterate(function(vocab) {
		if (vocab.t == 'l') {
			if (vocab.s == 'm') {
				highm = vocab.w;
			}
			else {
				loww = vocab.w;
				lows = vocab.s;
			}
		}
		return true; // continue
	});

	if (loww) {
		this.lessonid = loww;
		this.lesson = this.getLessonFromId(loww);
		this.phasendx = lows;
		this.startState = 'w';
	}
	else if (highm) {
		this.lessonid = highm;
		this.lesson = this.getLessonFromId(highm);
		this.phasendx = this.lesson.phases.length-1;
		this.startState = 'm';
	}
	else {
		this.lessonid = this.lessons[0].id;
		this.lesson = this.lessons[0];
		this.phasendx = 0;
		this.startState = 'u';
	}
}

voyc.Lessons.prototype.getLessonFromId = function(id) {
	var lesson = false;
	for (var i=0; i<this.lessons.length; i++) {
		lesson = this.lessons[i];
		if (lesson.id == id) {
			break;
		}
	}
	return lesson;
}
voyc.Lessons.prototype.current = function() {
	var lesson = false;
	for (var i=0; i<this.lessons.length; i++) {
		lesson = this.lessons[i];
		if (lesson.id == this.lessonid) {
			break;
		}
	}
	return lesson;
}

voyc.Lessons.prototype.currentNdx = function() {
	var ndx = false;
	for (var i=0; i<this.lessons.length; i++) {
		lesson = this.lessons[i];
		if (lesson.id == this.lessonid) {
			ndx = i;
			break;
		}
	}
	return ndx;
}

voyc.Lessons.prototype.next = function() {
	var lesson = false;
	var ndx = this.currentNdx();
	ndx++;
	if (ndx < this.lessons.length) {
		lesson = this.lessons[ndx];
	}
	this.lessonid = lesson.id;
	this.lesson = lesson;
	this.phasendx = 0;
	return lesson;
}

voyc.Lessons.prototype.isLessonFinished = function() {
	return (this.phaseid >= this.lesson.phases.length-1);
}

voyc.Lessons.prototype.isLastLesson = function() {
	return (this.currentNdx() >= this.lessons.length-1);
}

voyc.phases = ['glyph', 'word', 'phrase', 'sentence', 'story'];

voyc.lessons = [
	{
		id:'kh',
		section: 'Keyboard',
		name: 'Home Keys',
		sequence: 1,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:3,
		phases: ['glyph', 'word'],
		glyph: ['ด','่','ก','า','ห','ส','ฟ','ว'],
		word:[],
	},{
		id:'ki',
		section: 'Keyboard',
		name: 'Index and Middle Finger',
		sequence: 2,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:3,
		phases: ['glyph', 'word'],
		glyph: ['พ','ี','อ','ท','ำ','ร','แ','ม'],
		word:[],
	},{
		id:'krp',
		section: 'Keyboard',
		name: 'Ring Finger and Pinkie',
		sequence: 4,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:3,
		phases: ['glyph', 'word'],
		glyph: ['ไ','น','ป','ใ','ๆ','ย','ผ','ฝ'],
		word:[],
	},{
		id:'kic',
		section: 'Keyboard',
		name: 'Index Finger Center',
		sequence: 6,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases: ['glyph', 'word'],
		glyph: ['เ','้','ะ','ั','ิ','ื'],
		word:[],
	},{
		id:'kpr',
		section: 'Keyboard',
		name: 'Pinkie Reach',
		sequence: 7,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases: ['glyph', 'word'],
		glyph: ['ง','บ','ล'],
		word:[],
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
ภึถุ      8     high index finger
คตๅจขช  9     high right hand


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
