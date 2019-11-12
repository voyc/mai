/**
**/
voyc.Lessons = function(vocab) {
	this.vocab = vocab;
	this.lessons = voyc.lessons; // the array of lessons
	this.lessonid = ''; // the id of the current lesson
	this.lesson = null; // the current lesson object
	this.phasendx = -1; // the current phase of the current lesson, a zero-based index into phases array
	this.direction = 'normal';
	this.settings = {};
	this.settings.firstLessonId = 'kh';
}

voyc.Lessons.prototype.setup = function() {
	// get most recent lesson state
	//   what do we find when we iterate the lesson ids in vocab?
	//     multiple mastered lessons
	//     multiple started lessons, each in a different phase
	//   in vocab, state = m or the phase ndx
	//   if there are lessons in progress, we want the most recenct one
	//   find the most recent lesson
	//     if it is mastered, go to the next one
	//     if it is not mastered, restart the current phase
	var mostrecent = 0;
	var mostrecentid = '';
	var mostrecentstate = '';
	this.vocab.iterate(function(voc) {
		if (voc.t == 'l' && voc.r > mostrecent) {
			mostrecent = voc.r;
			mostrecentid = voc.w;
			mostrecentstate = voc.s;
		}
	});

	this.lessonid = mostrecentid;
	this.lesson = this.getLessonFromId(this.lessonid);
	this.phasendx = mostrecentstate;

	// three possible start states:
	//    first time ever	
	//    most recent lesson was completed, start a new lesson
	//    most recent lesson in progress
	if (this.lessonid == '') {
		this.lessonid = this.settings.firstLessonId;
		this.lesson = this.getLessonFromId(this.lessonid);
		this.phasendx = 0;
		this.startState = 'u';  // first time ever
	}
	else if (this.phasendx == 'm') {
		this.startState = 'm'; // previous lesson was mastered
	}
	else {
		this.startState = 'w'; // previous lesson is in-progresss
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

voyc.lessons = [
	{
		id:'kh',
		section: 'Keyboard',
		name: 'Home Keys',
		sequence: 1,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:3,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
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
		phases: ['glyph', 'word'],
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
		phases: ['glyph', 'word'],
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
		phases: ['glyph', 'word'],
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
		phases: ['glyph', 'word'],
		glyph: ['ง','บ','ล'],
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
