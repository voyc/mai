/**
**/
voyc.thai.course.co.helo = {
	section:'Conversation',
	course:'Hello Goodbye',
}

voyc.thai.course.co.helo.wh = {
	id:'cohelowh',
	prereq:true,
	postreq:false,
	primaryDictType: 'phrase',
	glyph:[],
	word:[],
	phrase:[
		'สวัส ดี ครับ', 
		'สวัส ดี คะ',
		'สบาย ดี ไหม ครับ', 
		'สบาย ดี คะ',
		'แล้ว คุณ ละ',
		'คุณ ละ',
		'สบาย ดี ครับ',
	]
};

voyc.thai.course.co.helo.ye = {
	id:'coheloye',
	prereq:true,
	postreq:false,
	primaryDictType: 'phrase',
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
	]
};

voyc.thai.course.co.helo.or = {
	id:'coheloor',
	prereq:true,
	postreq:false,
	primaryDictType: 'phrase',
	glyph:[],
	word:[],
	phrase:[
		'โชคดี',
		'ขับ ปลอดภัย',
		'เดินทาง ปลอดภัย',
		'เดินทาง โดย ความปลอดภัย',
		'ขอให้ มี ความสุข วันหยุด สุดสัปดาห์',
		'ขอให้ มี ความสุข ใน วันหยุด',
		'ดูแล ตัวเอง ด้วย นะ',
		'ราตรี สวัสดิ์',
	]
};

voyc.thai.course.co.helo.gr = {
	id:'cohelogr',
	prereq:true,
	postreq:false,
	primaryDictType: 'phrase',
	glyph:[],
	word:[],
	phrase:[
		'นอนหลับฝันดี',
		'ฝันดี',
		'นอนหลับ ฝันดี ราตรี สวัสดิ์',
	]
};
voyc.onCourseLoaded('cohelo');

