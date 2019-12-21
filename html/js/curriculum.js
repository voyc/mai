/**
	class Curriculum\
	@constructor

	Display the list of courses, with a link to each.
	Show the level reached for each course.

	The curriculum heirarchy is:
		section > course > level > drill
	
	section = folder
	course = filename.js
	id = 2-char section, 4-char course, 2-char level; key to vocab

	bear in mind the section and course names will be displayed in either english or thai
	let the id be readable, use it in all logical uses.  Use section and course only for display.

	User selects a course.
	Noam analyzes the course to see if it is appropriate.
	Sam steps through the levels and drills.
	Lee conducts a drill on each drill.
**/

voyc.Curriculum = function(container, observer, vocab) {
	// is singleton
	if (voyc.Curriculum._instance) return voyc.Curriculum._instance;
	else voyc.Curriculum._instance = this;

	this.container = container;
	this.observer = observer;
	this.vocab = vocab;
	this.setup();
}

voyc.Curriculum.prototype.setup = function() {
	this.lang = 'thai';
	voyc[this.lang].course = {};
	this.coursebase = voyc[this.lang].course;
	var self = this;
	this.observer.subscribe('curriculum-requested', 'curriculum', function(note) {self.drawCurriculum();});
}

voyc.Curriculum.prototype.drawCurriculum = function() {
	var s = '';
	s += "<table>";
	var section = '';
	for (var c in voyc[this.lang].courselist) {
		var cur = voyc[this.lang].courselist[c];
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
			var lcid = voyc.levelColors[l-1].id;
			var voc = this.vocab.get(cur.id + lcid);
			if (voc && voc.s == 'm') {
				s += "&#x2714;"; // checkmark
			}
			else {
				s += "&#x2003;"; // blankspace
			}
			s += "</td>";
		}
		s += "</tr>";
	}
	s += "</table>";
	this.container.innerHTML = s;
	this.attachDomEventHandlers();
	(new voyc.Minimal).attachAll(this.container);
}

voyc.Curriculum.prototype.attachDomEventHandlers = function() {
	var self = this;
	for (var c in voyc[this.lang].courselist) {
		var cur = voyc[this.lang].courselist[c];
		voyc.$(cur.id).addEventListener('click', function(evt) {
			var id = evt.currentTarget.id;
			var folder = id.substr(0,2);
			var filename = id.substr(2,4)+'.js';
			if (!self.coursebase[folder]) {
				self.coursebase[folder] = {};
			}
			var coursefile = self.lang+'/course/'+folder+'/'+filename;
			console.log('loading '+coursefile);
			voyc.appendScript(coursefile);
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
	var c = voyc[this.lang].course[sectionid][courseid];
	s += '<h2>'+c.section+': '+c.course+'</h2>';
	for (var i=0; i<voyc.levelColors.length; i++) {
		var levelColor = voyc.levelColors[i]; 
		s += this.drawLevel(c, levelColor);
	}
	return s;
}

voyc.Curriculum.prototype.drawGlyph = function(c) {
	var r = c;
	var u = '&#9676;';
	var diacritics = 'ืิ์้่ัีุูึำ็';
	if (diacritics.indexOf(r) > -1) {
		r = u + r;
	}
	return r;
}

voyc.Curriculum.prototype.drawLevel = function(c, level) {
	var s = '';
	if (typeof(c[level.id]) == 'undefined') {
		return s;
	}
	s += '<div class="panel '+level.id+'">';
	s += '<h3>'+level.name+'</h3>';
	s += '<table class="horz">';
	var lvl = c[level.id];
	if (lvl.primaryDictType == 'glyph') {
		for (var i=0; i<lvl.glyph.length; i++) {
			s += '<tr><td>';
			s += this.drawGlyph(lvl.glyph[i]);
			s += '</td></tr>';
		}
	}
	else if (lvl.primaryDictType == 'word') {
		for (var i=0; i<lvl.word.length; i++) {
			s += '<tr><td>';
			s += lvl.word[i];
			s += '</td></tr>';
		}
	}
	else if (lvl.primaryDictType == 'phrase') {
		for (var i=0; i<lvl.phrase.length; i++) {
			s += '<tr><td>';
			s += lvl.phrase[i];
			s += '</td></tr>';
		}
	}
	s += '</table>';
	s += "<p><button class='drill' id='"+lvl.id+"'>Drill</button></p>";
	s += '</div>';
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
