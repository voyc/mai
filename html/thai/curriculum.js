/**
	class Curriculum\
	@constructor

	Display the list of courses, with a link to each.
	Show the level reached for each course.

	The curriculum heirarchy is:
		section > course > lesson > phase (drill)
	
	section = folder
	course = filename.js
	id = three letter unique identifier, derived from section/name, key to vocab

	bear in mind the section and course names will be displayed in either english or thai
	let the id be readable, use it in all logical uses.  Use section and course only for display.

	User selects a course.
	Noam analyzes the course to see if it is appropriate.
	Sam steps through the lessons and phases.
	Lee conducts a drill on each phase.
**/

voyc.Curriculum = function() {
	// is singleton
	if (voyc.Curriculum._instance) return voyc.Curriculum._instance;
	else voyc.Curriculum._instance = this;
}

voyc.Curriculum.prototype.setup = function(container) {
	var s = this.drawCurriculum();
	container.innerHTML = s;
	this.attachDomEventHandlers();
	(new voyc.Minimal).attachAll(container);
}

voyc.Curriculum.prototype.drawCurriculum = function() {
	var s = '';
	s += "<table>";
	var section = '';
	for (var c in voyc.courselist) {
		var cur = voyc.courselist[c];
		// header row for each section
		if (cur.section != section) {
			s += "<tr><td class='section' colspan=10>"+cur.section+"</td></tr>";
			section = cur.section;
		}
		// column 1: course name
		s += "<tr><td><button id='"+cur.id+"' class='anchor'>"+cur.course+"</button></td>";
		// columns 2 thru 10: level 1 thru 9
		var level1 = 2;
		for (var l=1; l<=9; l++) {
			s += "<td>";
			if (cur.level >= ((l+2) - level1)) {
				s += "&#x2714;";
			}
			else {
				s += "&#x2003;";
			}
			s += "</td>";
		}
		s += "</tr>";
	}
	s += "</table>";
	return s;
}

voyc.Curriculum.prototype.attachDomEventHandlers = function() {
	var self = this;
	for (var c in voyc.courselist) {
		var cur = voyc.courselist[c];
		voyc.$(cur.id).addEventListener('click', function(evt) {
			var id = evt.currentTarget.id;
			var folder = id.substr(0,2);
			var filename = id.substr(2,4)+'.js';
			console.log(folder+'/'+filename);
		}, false);
	}
}

window.addEventListener('load', function(evt) {
	voyc.curriculum = new voyc.Curriculum();
	voyc.curriculum.setup(voyc.$('curriculum'));
}, false);

voyc.courselist = [
	{ id:'grkybd', section: 'Grammar', course: 'Keyboard', level: 9, },
	{ id:'gralph', section: 'Grammar', course: 'Alphabet', level: 7, },
	{ id:'grcons', section: 'Grammar', course: 'Consonants', level: 5, },
	{ id:'grvowl', section: 'Grammar', course: 'Vowels', level: 3, },
	{ id:'grtone', section: 'Grammar', course: 'Tones', level: 2, },
	{ id:'grsynt', section: 'Grammar', course: 'Syntax', level: 1, },
	{ id:'cohelo', section: 'Conversation', course: 'Hello Goodbye', level: 8,},
	{ id:'cothnk', section: 'Conversation', course: 'Thank You', level: 6,},
	{ id:'coname', section: 'Conversation', course: 'Names', level: 3,},
	{ id:'cosign', section: 'Conversation', course: 'Signs', level: 3,},
	{ id:'colaun', section: 'Conversation', course: 'Laundry', level: 1,},
	{ id:'cohous', section: 'Conversation', course: 'Housing', level: 1,},
	{ id:'cowher', section: 'Conversation', course: 'Where', level: 1,},
	{ id:'cowhen', section: 'Conversation', course: 'When', level: 1,},
	{ id:'cowhoo', section: 'Conversation', course: 'Who', level: 0,},
	{ id:'cofmly', section: 'Conversation', course: 'Family', level: 0,},
	{ id:'comrkt', section: 'Conversation', course: 'Market', level: 0,},
	{ id:'cofood', section: 'Conversation', course: 'Food', level: 0,},
	{ id:'coclot', section: 'Conversation', course: 'Clothing', level: 0,},
	{ id:'comenu', section: 'Conversation', course: 'Menu', level: 0,},
	{ id:'comedi', section: 'Conversation', course: 'Medical', level: 0,},
	{ id:'coromc', section: 'Conversation', course: 'Romance/Sex', level: 0,},
	{ id:'enhist', section: 'Encyclopedia', course: 'History', level: 0,},
	{ id:'engeog', section: 'Encyclopedia', course: 'Geography', level: 0,},
	{ id:'enbuda', section: 'Encyclopedia', course: 'Buddhism', level: 0,},
	{ id:'enflow', section: 'Encyclopedia', course: 'Flowers', level: 0,},
	{ id:'encmai', section: 'Encyclopedia', course: 'Chiang Mai', level: 0,},
	{ id:'sobdss', section: 'Songs', course: 'Bird: Sabai Sabai', level: 0,},
	{ id:'sobabu', section: 'Songs', course: 'Bird+Atom: Beyond Universe', level: 0,},
	{ id:'socilu', section: 'Songs', course: 'พลพล: ให้ ฉัน รัก เธอ ได้ ไหม', level: 0,},
	{ id:'mnbk01', section: 'Maanii', course: 'Book 1', level: 0,},
	{ id:'mnbk02', section: 'Maanii', course: 'Book 2', level: 0,},
	{ id:'mnbk03', section: 'Maanii', course: 'Book 3', level: 0,}
];
