/*
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

3. in lessons, use local patterns, added auto to grammar
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

x 4. load lessons dynamically

x 5. generate list of lessons dynamically

6. perequisites
	glyphs
	words
	phrases?

make a list of glyphs in the story
	mark those mastered already
make a list of words in the story
	mark those mastered already
make a list of phrases used in the story?

noam:
	vet story
		check all glyphs, make sure they are in alphabet
		check all words, make sure they are in dictionary
	compare vetting to vocab
		mark all already mastered
*/

if (typeof(voyc.course.co) == 'undefined') {
	voyc.course.co = {};
}

voyc.course.co.helo = {
	section:'Conversation',
	course:'Hello Goodbye',
}

voyc.course.co.helo.wh = {
	id:'cohelowh',
	algorithm: 'sequential',
	initialShuffle: false,
	workSize:3,
	phases: ['word', 'word-reverse', 'phrase', 'phrase-reverse'],
	phasen: 0,
	phrase:[],
	word:[
		'สวัส', 
		'ดี',
		'ครับ', 
		'คะ',
		'สบาย', 
		'ไหม', 
		'แล้ว',
		'คุณ',
		'ละ',
	],
	story:[
		'สวัส ดี่ ครับ', 
		'สวัส ดี่ คะ',
		'สขาย ดี่ ไหม ครับ', 
		'สขาย ดี่ คะ',
		'[แลัว] คุณ ล่ะ',
		'สขาย ดี่ ครับ ',
	]
};

voyc.course.co.helo.ye = {
	id:'coheloye',
	phases: ['word', 'word-reverse', 'phrase', 'phrase-reverse'],
	phasen: 0,
	word:[
		'แล้ว พบ กัน ใหม่',
		'แล้ว เจอ กัน',
		'แล้ว พบ กัน ภาย ใน ๑ ชั่วโมง',
		'ลา ก่อน',
		'ไป ละ นะ',
		'ไป ก่อน นะ',
		'ลา ละ นะ',
		'กลับก่อนนะ',
		'โชคดี',
		'ขับ ปลอดภัย',
		'เดินทาง ปลอดภัย',
		'เดินทาง โดย ความปลอดภัย',
		'ขอให้ มี ความสุข วันหยุด สุดสัปดาห์',
		'ขอให้ มี ความสุข ใน วันหยุด',
		'ดูแล ตัวเอง ด้วย นะ',
		'ราตรี สวัสดิ์',
		'นอนหลับฝันดี',
		'ฝันดี',
		'นอนหลับ ฝันดี ราตรี สวัสดิ์',
	]
};

voyc.onCourseLoaded('cohelo');

