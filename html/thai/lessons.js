/**
**/
voyc.Lessons = function(vocab) {
	this.vocab = vocab;  // each lesson state is stored in vocab
	this.lessons = voyc.lessons; // static array of lessons
	this.current = null; // a copy of the current lesson object, copied to localStorage
	this.settings = {};
	this.settings.firstLessonId = this.lessons[0].id;
	this.settings.lastLessonId = this.lessons[this.lessons.length-1].id;
}

voyc.Lessons.prototype.getPrevious = function() {
	// get most recent lesson state from vocab
	var prev = {w:'', s:'', r:0};
	this.vocab.iterate(function(voc) {
		if (voc.t == 'l' && voc.r > prev.r) {
			prev = {w:voc.w, r:voc.r, s:voc.s};
		}
	});

	//if (prev.s == 'm') {
	//	startState = 'm'; // previous lesson was mastered, do next()
	//}
	//else if (prev.w) {
	//	startState = 'w'; // previous lesson is in-progress, do restart()
	//}
	//else if (!prev.w) {
	//	startState = 'u'; // first time ever, new user, lesson 1
	//	prev.w = this.settings.firstLessonId;
	//}

	this.current = voyc.cloneObject(this.getLessonFromId(prev.w));
	this.current.phasen = (prev) ? prev.s : -1;

	// get previous lesson object from localStorage
	// if present, overwrite the object created from vocab above
	// it should match the vocab data, but will have words and phrases in addition
	var lesson = JSON.parse(localStorage.getItem('lesson'));
	if (lesson && lesson.id != this.current.id) 
		debugger;
	if (lesson) {
		this.current = lesson;
	}

	// write to localStorage
	localStorage.setItem('lesson', JSON.stringify(this.current));
	return this.current;
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

voyc.Lessons.prototype.currentNdx = function() {
	var ndx = false;
	for (var i=0; i<this.lessons.length; i++) {
		var lesson = this.lessons[i];
		if (lesson.id == this.current.id) {
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
	return lesson;
}

voyc.Lessons.prototype.isLessonFinished = function() {
	return (this.current.phasen >= this.current.phases.length-1);
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
