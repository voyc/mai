

voyc.thai.course.gr.kybd = {
	lang:'thai',
	section:'Grammar',
	course:'Keyboard',
	description:'This course helps you learn to type on a thai keyboard.  This can be very helpful for using email, Line, and Facebook.',
}

voyc.thai.course.gr.kybd.wh = {
	id:'grkybdwh',
	name: 'Home Keys',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize: 3,
	phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
	glyph: ['ด','่','ก','า','ห','ส','ฟ','ว'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.yl = {
	id:'grkybdyl',
	name: 'Index and Middle Finger',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:3,
	phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
	glyph: ['พ','ี','อ','ท','ำ','ร','แ','ม'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.or = {
	id:'grkybdor',
	name: 'Ring Finger and Pinkie',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:3,
	phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
	glyph: ['ไ','น','ป','ใ','ๆ','ย','ผ','ฝ'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.gr = {
	id:'grkybdgr',
	name: 'Index Finger Center',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
	glyph: ['เ','้','ะ','ั','ิ','ื'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.bl = {
	id:'grkybdbl',
	name: 'Pinkie Reach',
	sequence: 7,
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
	glyph: ['ง','บ','ล'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.pu = {
	id:'grkybdpu',
	name: 'High Right',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
	glyph: ['ุ','ึ','ค','ต','จ','ข','ช'],
	word:[],
	phrase:[]
};
/*
voyc.thai.course.gr.kybd.re = {
	id:'grkybdre',
};
voyc.thai.course.gr.kybd.br = {
	id:'grkybdbr',
};
voyc.thai.course.gr.kybd.bk = {
	id:'grkybdbk',
};
*/
/*
ภถๅ       high left
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

voyc.onCourseLoaded('grkybd');
