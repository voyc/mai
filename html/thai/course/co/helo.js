// moved to curriculum.js
//if (typeof(voyc.thai.course.co) == 'undefined') {
//	voyc.thai.course.co = {};
//}

voyc.thai.course.co.helo = {
	section:'Conversation',
	course:'Hello Goodbye',
}

voyc.thai.course.co.helo.wh = {
	id:'cohelowh',
	algorithm: 'sequential',
	initialShuffle: false,
	workSize:3,
	phases: ['word', 'word-reverse', 'phrase', 'phrase-reverse'],
	phasen: 0,
	phrase:[],
	glyph:[],
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
	phrase:[
		'สวัส ดี ครับ', 
		'สวัส ดี คะ',
		'สบาย ดี ไหม ครับ', 
		'สบาย ดี คะ',
		'[แลัว] คุณ ละ',
		'สบาย ดี ครับ ',
	]
};

voyc.thai.course.co.helo.ye = {
	id:'coheloye',
	phases: ['word', 'word-reverse', 'phrase', 'phrase-reverse'],
	phasen: 0,
	glyph:[],
	word:[],
	phrase:[
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

