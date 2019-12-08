// moved to curriculum.js
//if (typeof(voyc.course.co) == 'undefined') {
//	voyc.course.co = {};
//}

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

