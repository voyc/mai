/**
	class Curriculum\
	@constructor

	Display the list of courses, with a link to each.
	Show the level reached for each course.

	The curriculum heirarchy is:
		section > course > level > phase (drill)
	
	section = folder
	course = filename.js
	id = 2-char section, 4-char course, 2-char level; key to vocab

	bear in mind the section and course names will be displayed in either english or thai
	let the id be readable, use it in all logical uses.  Use section and course only for display.

	User selects a course.
	Noam analyzes the course to see if it is appropriate.
	Sam steps through the levels and phases.
	Lee conducts a drill on each phase.
**/

/*
TODO
separate curriculum and the courselist
	leave courselist in thai folder
	move curriculum to js
fold lesson.js into curriculum.js
replace "lesson" with "level" throughout
resolve "curriculum" vs "courselist"

1. to display any page
	find texts on the page (always english)
	translate to thai
	lookup in vocab
	if in vocab, use thai

2. start conversation
	persons:
		self: name, age, gender
		other: name, age, gender
		third: name, age, gender

3. in levels, use local patterns, added auto to grammar
	functions
		@polite (depends on gender of speaker)
		@person('self', 'name')
		@person('self', 'age')
		@person('self', 'gender')
		@person('other', 'name')
		@person('other', 'age')
		@person('other', 'gender')
		@person('third', 'name')
		@person('third', 'age')
		@person('third', 'gender')
		@person('self', 'name'): สวัส ดี่ [@polite]

x 4. load levels dynamically

x 5. generate list of levels dynamically

6. perequisites
	glyphs
	words
	phrases?


change lesson to course/gr/kbrd ??

1. Discover the story.
	what should the phases be?  story only?

2. make a list of glyphs in the story
	mark those mastered already
	store the remainder in glyph[]

3. run the drill on glyph

4. make a list of words in the story
	mark those mastered already
	make sure you have one word for each glyph
	store the remainder in word[]

5. run the drill on word

(make a list of phrases used in the story?)

6. run the drill on the story

noam:
	vet story
		check all glyphs, make sure they are in alphabet
		check all words, make sure they are in dictionary
	compare vetting to vocab
		mark all already mastered
*/


voyc.Curriculum = function() {
	// is singleton
	if (voyc.Curriculum._instance) return voyc.Curriculum._instance;
	else voyc.Curriculum._instance = this;
}

voyc.Curriculum.prototype.setup = function(container) {
	voyc.course = {};
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
			var lang = 'thai';
			var courseroot = 'course';
			if (!voyc[lang][courseroot][folder]) {
				voyc[lang][courseroot][folder] = {};
			}
			var coursefolder = lang+'/'+courseroot+'/'+folder;
			console.log('loading '+coursefolder+'/'+filename);
			voyc.appendScript(coursefolder+'/'+filename);
		}, false);
	}
}

voyc.Curriculum.prototype.onCourseLoaded = function(id) {
	var s = this.drawCoursePage(id);
	voyc.$('course').innerHTML = s;
	(new voyc.BrowserHistory).nav('course');
	this.attachCourseEventHandlers();
}

voyc.Curriculum.prototype.drawCoursePage = function(id) {
	var s = '';
	var sectionid = id.substr(0,2);
	var courseid = id.substr(2,4);
	var c = voyc.course[sectionid][courseid];
	s += '<h2>'+c.section+': '+c.course+'</h2>';
	for (var i=0; i<voyc.levels.length; i++) {
		var level = voyc.levels[i]; 
		s += this.drawLevel(c, level);
	}
	return s;
}

voyc.Curriculum.prototype.drawLevel = function(c, level) {
	var s = '';
	if (typeof(c[level.id]) == 'undefined') {
		return s;
	}
	s += c.section;
	s += c.course;
	s += level.name;
	s += '<br/>';
	var lvl = c[level.id];
	for (var i=0; i<lvl.word.length; i++) {
		s += lvl.word[i];
		s += '<br/>';
	}
	s += "<button class='drill' id='"+lvl.id+"'>Drill</button>";
	return s;
}

voyc.Curriculum.prototype.attachCourseEventHandlers = function() {
	var coursePage = document.getElementById('course');
	var drillButtons = coursePage.querySelectorAll("button.drill");
	drillButtons.forEach(function(btn) {
		btn.addEventListener('click', function(evt) {
			var id=evt.currentTarget.id;	
			console.log(id);
			voyc.mai.sam.startLevel(id);
		});
	});
}

voyc.onCourseLoaded = function(id) {
	voyc.curriculum.onCourseLoaded(id);
}

window.addEventListener('load', function(evt) {
	voyc.curriculum = new voyc.Curriculum();
	voyc.curriculum.setup(voyc.$('curriculum'));
}, false);

voyc.levels = [
	{ id:'wh', name:'white', color:'white' },
	{ id:'ye', name:'yellow', color:'yellow' },
	{ id:'or', name:'orange', color:'orange' },
	{ id:'gr', name:'green', color:'green' },
	{ id:'bl', name:'blue', color:'blue' },
	{ id:'pu', name:'purple', color:'purple' },
	{ id:'re', name:'red', color:'red' },
	{ id:'br', name:'brown', color:'brown' },
	{ id:'bk', name:'black', color:'black' },
]
