/**
**/
voyc.thai.course.au.da01 = {
        section:'AUA',
        course:'Nouns and Adjectives', /* day 1, 17 Sep */
}

voyc.thai.course.au.da01.wh = {
        id:'auda01wh',
        prereq:true,
        postreq:false,
        algorithm: 'progressive',
        primaryDictType: 'word',
        glyph:[],
        word:[
		'ผู้ชาย',
		'ผู้หญิง',
		'สวย',
		'หล่อ',
		'สูง',
		'เตี้ย',
		'ง่วง',
	],
        phrase:[
		'ผู้หญิง สวย',
		'ผู้ชาย หล่อ',
		'ผู้หญิง สูง',
		'ผู้ชาย เตี้ย',
		'Q:ผู้ชาย สูง ไหม A:สูง',
		'Q:ผู้ชาย เตี้ย ไหม A:ไม่ เตี้ย',
		'Q:ผู้หญิง สวย ไหม A:สวย',
		'Q:ผู้หญิง ง่วง ไหม A:ไม่ ง่วง',
	],
};

voyc.thai.course.au.da01.ye = {
        id:'auda01ye',
        prereq:true,
        postreq:true,
        algorithm: 'progressive',
        primaryDictType: 'word',
        glyph:[],
        word:[
		'คุณ',
		'เรา',
		'เขา',
		'อ้วน',
		'ผอม',
		'เหนื่อย',
		'เก่ง',
	],
        phrase:[],
};

voyc.thai.course.au.da01.or = {
        id:'auda01or',
        prereq:true,
        postreq:true,
        algorithm: 'progressive',
        primaryDictType: 'word',
        glyph:[],
        word:[
		'หมู',
		'ไก่',
		'ม้า',
		'หมู',
		'กุ้ง',
		'ใหญ่',
		'เล็ก',
		'ร้อน',
	],
        phrase:[],
};

voyc.thai.course.au.da01.gr = {
        id:'auda01gr',
        prereq:true,
        postreq:true,
        algorithm: 'progressive',
        primaryDictType: 'word',
        glyph:[],
        word:[
		'เป็ด',
		'แมว',
		'ปลา',
		'ยุง',
		'วัว',
		'เย็น',
		'หนา',
		'เผ็ด',
	],
        phrase:[],
};
voyc.onCourseLoaded('auda01');

/*
เชียงใหม่	FL	Chiangmai
นา		M	rice field
A.U.A.
ธนาคาร		HMM	bank
ไปรษณีย์	MLM	post office
ตลาด	ML	market
บ้าน	F	home, house
ร้าน	H	store
ห้อง	F	room	
ครัว	M	kitchen

โรง		M	building
โรงเรียน	MM	school
โรงพยาบาล	MHMM	hospital
โรงงาน		MM	factory

น้ำมัน	HM	oil (water+fat)
หอย	R	shellfish

อาหาร	MR	food
ผลไม้	RHH	fruit
น้ำ	H	water
ข้าว	F	rice
ข้าวเหนียว	FR	sticky rice
เหนือ		?
Khay		?
ผัก	L	vegetable
ปลาหมึก	ML	fish + ink (squid, octopus)

สะอาด	LL	clean
หวาน	R	sweet
เปรี้ยว	F	sour


patterns
compound noun
noun+adj
noun+owner
noun adj

noun + nation
noun + noun

Q: noun adj ไหม kh
Ap: adj
An: ไม่ adj

Q: noun adj ใช่ไหม kh
Ap: ใช่
An: ไม่ใช่

Q: noun adj หรือ kh
Ap: kh
An: ไม่ kh
*/

/*
Verbs
ไป    M    go to
มา    M    come
กิน    M    eat 
ดื่ม    L    drink 
เรียน    M    study 
พูด    F    speak 
อ่าน    L    read 
เขียน    R    write 
ช่วย    F    help
ดู    M    see (by intention), watch 
เห็น    R    see (by accident)
หา    R    look for 
พบ    H    meet 
ได้ยิน    FM    hear 
ฟัง    M    listen 
เข้าใจ    FM    understand 

Nouns
หนา    R    thick
บาง    M    thin
หน้า    F    1) face, 2) surface, 3) season, 4) seasonal, 5) page
เนื้อ    H    1) meat, 2) beef, 3) texture

Patterns

Q: อะไร adj kh
A: (place, animal, thing) kh

Q: ใคร adj kh
A: person kh

Q: noun adj kh
Ap: adj ky
fQ: noun ล่ะ kh

Subj + verb + object

*/
