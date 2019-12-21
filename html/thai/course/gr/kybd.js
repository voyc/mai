

voyc.thai.course.gr.kybd = {
	lang:'thai',
	section:'Grammar',
	course:'Keyboard',
	description:'This course helps you learn to type on a thai keyboard.  This can be very helpful for using email, Line, and Facebook.',
}

voyc.thai.course.gr.kybd.wh = {
	id:'grkybdwh',
	name: 'Home Keys',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize: 3,
	prereq:false,
	postreq:true,
	glyph: ['ด','่','ก','า','ห','ส','ฟ','ว'],
	word:['ดาว','สด','กว่า','หก','สาว','ว่า','หา','กา','ฟาด'],
	phrase:[]
};
voyc.thai.course.gr.kybd.ye = {
	id:'grkybdye',
	name: 'Index and Middle Finger',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:3,
	prereq:false,
	postreq:true,
	glyph: ['พ','ี','อ','ท','ำ','ร','แ','ม'],
	word:['พร','ทำ','ที','พอ','มี','รำ','ออม','แรม'],
	phrase:[]
};
voyc.thai.course.gr.kybd.or = {
	id:'grkybdor',
	name: 'Ring Finger and Pinkie',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:3,
	prereq:false,
	postreq:true,
	glyph: ['ไ','น','ป','ใ','ๆ','ย','ผ','ฝ'],
	word:['ใน','ไป','ฝน'],
	phrase:[]
};
voyc.thai.course.gr.kybd.gr = {
	id:'grkybdgr',
	name: 'Index Finger Center',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	prereq:false,
	postreq:true,
	glyph: ['เ','้','ะ','ั','ิ','ื'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.bl = {
	id:'grkybdbl',
	name: 'Pinkie Reach',
	primaryDictType:'glyph',
	sequence: 7,
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	prereq:false,
	postreq:true,
	glyph: ['ง','บ','ล'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.pu = {
	id:'grkybdpu',
	name: 'High Right',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	prereq:false,
	postreq:true,
	glyph: ['ุ','ึ','ค','ต','จ','ข','ช'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.re = {
	id:'grkybdre',
	name:'Shift 1',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	prereq:false,
	postreq:true,
	glyph: ['โ','ณ','ธ','ฯ','ฉ','ฮ','์','ู'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.br = {
	id:'grkybdbr',
	name:'Shift 2',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	prereq:false,
	postreq:true,
	glyph: ['็','ษ','ฑ','ญ','ซ','ศ','ฬ','ฦ','฿'],
	word:[],
	phrase:[]
};
voyc.thai.course.gr.kybd.bk = {
	id:'grkybdbk',
	name:'Digits',
	primaryDictType:'glyph',
	algorithm: 'progressive',
	initialShuffle: false,
	workSize:4,
	prereq:false,
	postreq:true,
	glyph: ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙'],
	word:[],
	phrase:[]
};
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
