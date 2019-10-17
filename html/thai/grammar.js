/** 
	Syntactic Structures
	contains only parts of speech and parts of sentences
	using the rewrite conventions of Noam Chomsky
	non-zero id identifies those structures that must be mastered before use
	parts of speech (pos) = n, v, intj, adj, adv, conj, prep, 
	sentenceParts = {pos} s v o clause phrase
	sentenceTypes = declarative, imperative, interogative, exclamative
**/
voyc.syntacticStructures = `
	sentence > clause
	clause > s v o
	clause > s adj
	s > n
	o > n
	sentence > clause conj clause
	n > n v
	n > s v o
	sentence > question
	sentence > imperative
	sentence > expression
	sentence > declarative
	question > declarative questionword
	conversation > Q: question A: answer
`;

/**
	Semantic Conventions
	expressed using same rewrite conventions of Syntactic Structures
	but name must be unique
**/
voyc.semanticConventions = `
	n > {person,animal,place,thing}
	n > n owner
	n > n adj
	n > s v o
	n > s v
	n > v o
	thing > {food}
	food > {meat,vegetable,fruit,beverage}
	meat > {หมู ไก่ เป็ด ปลา กุ้ง หอย ปลาหมึก เนื้อ}
`;
voyc.semanticConventions = `
expression @hello > สวัสดี @polite
expression @howAreYou > [{คุณ} เป็น อย่าง [อะไร,ไร,ไง] บ้าง,สบาย ดี ไหม] @polite
expression @polite > [คะ,ครับ]
expression @meToo > [ฉัน,ผม] ด้วย
phrase @rent > $number(1000,30000,500) {บาท} ต่อ เดือน
phrase @rentDeposit > ค่ามัดจำ $number(1000,30000,500) บาท
expr @takeCare > ดูแล ตัวเอง ด้วย
expr @seeYouLater > {แล้ว} [เจอ,พบ] กัน [ใหม่,ภาย ใน $number(1,8,1) ชั่วโมง]
expr @iGo > กลับ ก่อน นะ
expr @iStay > ขับ ปลอดภัย
expr @goodLuck > โชค ดี
expr @bonVoyage > [เดินทาง ปลอดภัย,เดินทาง โดย ความปลอดภัย]
expr @goodWeekend > ขอให้ มี ความสุข [สุดสัปดาห์,วันหยุด สุดสัปดาห์,ใน วันหยุด]
expr @goodNight > [{นอนหลับ} ฝัน ดี {ราตรี สวัสดิ์},ราตรี สวัสดิ์]
sentence @goodbye > [@seeYouLater,@takeCare,ลา [ก่อน,ละ นะ],ไป [ก่อน,ละ] นะ,@iGo,@iStay,@goodLuck,@bonVoyage,@goodWeekend,@goodNight]
phrase @laundry > [การซักรีด,ผ้าเช็ดตัว $number(1,5,1) ผืน,ผ้าปูที่นอน $number(1,5,1) ผืน,ปลอกหมอน $number(1,5,1) ปลอก,ซัก {รีด} [เสื้อ,เสื้อแขนสั้น,เสื้อแขนยาว,กางเกง,กางเกงขาสั้น,กางเกงขายาว] $number(1,5,1) ตัว]
expression @happyNewYear > ขอให้ มี ความสุข ใน วัน ขึ้นปีใหม่
expression @buyForMonks > ฉัน ซื้อ ส้ม $number(10,20,1) ผล [สำหรับ,เพื่อ] ใส่บาตร
noun @personNeutral > [คน,เรา,เขา,คุณ,ญาติ,เด็ก,พี่,น้อง,หลาน,ลูก,อา,น้า]
noun @personMale > [ผู้ชาย,พ่อ,พี่ชาย,ลูกชาย,น้องชาย,หลานชาย,อาผู้ชาย,น้าชาย,ปู่,ตา]
noun @personFemale > [ผู้หญิง,แม่,พี่สาว,ลูกสาว,น้องสาว,หลานสาว,อาผู้หญิง,น้าสาว,ย่า,ยาย]
noun @person > [@personNeutral,@personMale,@personFemale]
adj @adjPerson > [ตัวใหญ่,ตัวเล็ก,สูง,เตี้ย,อ้วน,ผอม,เหนื่อย,ง่วง,เก่ง,ขี้เกียจ,เมา]
phrase @describePerson > @person @adjPerson
sentence @comparePerson > @person @adjPerson กว่า @person
`;

/**
	JS Array of semantic conventions
**/
voyc.semantics = [
	{ pos:'noun', name:'@noun',type:'partofspeech',value:'' },
	{ pos:'verb', name:'@waaverb',type:'list',value:['พูด','ถาม','ได้ยิน','คิด','เขียน','อ่าน','เห็น','บอก','สอน','พิมพ์','ทราบ','รู้','เข้าใจ','สั่ง'] },
	{ pos:'noun', name:'@food',type:'list',value:['ผัก','ข้าว','ไข่','ไข่'] },
	{ pos:'noun', name:'@meat',type:'list',value:['หมู','ไก่','เป็ด','ปลา','กุ้ง','หอย','ปลาหมึก','เนื้อ'] },
	{ pos:'verb', name:'@auxverb',type:'list',value:['จะ','',] },
	{ pos:'verb', name:'@cook',type:'list',value:['ต้ม','ผัด','ทอด','ปิ้ง','ย่าง','อบ'] },
	
	{ pos:'verb', name:'@polite',type:'cat',value:['@politeMale','@politeFemale'] },
	{ pos:'verb', name:'@politeMale',type:'cat',value:['ครับ','นะครับ'] },
	{ pos:'verb', name:'@politeFemale',type:'cat',value:['คะ','นะคะ'] },

	{ pos:'verb', name:'@person',type:'cat',value:['@personNeutral','@personMale','@personFemale'] },
	{ pos:'verb', name:'@personNeutral',type:'list',value:['คน','เรา','เขา','คุณ','ญาติ','เด็ก','พี่','น้อง','หลาน','ลูก','อา','น้า'] },
	{ pos:'verb', name:'@personMale',type:'list',value:['ผู้ชาย','พ่อ','พี่ชาย','ลูกชาย','น้องชาย','หลานชาย','อาผู้ชาย','น้าชาย','ปู่','ตา'] },
	{ pos:'verb', name:'@personFemale',type:'list',value:['ผู้หญิง','แม่','พี่สาว','ลูกสาว','น้องสาว','หลานสาว','อาผู้หญิง','น้าสาว','ย่า','ยาย'] },

	{ pos:'adj',  name:'@adjperson',type:'list',value:['ตัวใหญ่','ตัวเล็ก','สูง','เตี้ย','อ้วน','ผอม','เหนื่อย','ง่วง','เก่ง','ขี้เกียจ','เมา'] },
	{ pos:'adj', name:'@adjfood',type:'list',value:['ร้อน','เย็น','เผ็ด','หวาน','เปรี้ยว'] },

	{ pos:'noun', name:'@roomType',type:'pattern',value:'[ห้อง,ห้องน้ำ,ห้องนอน,ห้องอาหาร]' },
	{ pos:'adj' , name:'@adjroom',type:'pattern',value:'[สะอาด,ร้อน,เย็น,กว้าง,ใหญ่,แคบ,เล็ก,สว่าง,เหม็นอับ]' },
	{ pos:'adj' , name:'@color',type:'pattern',value:'สี [ขาว,ดํา,แดง,เหลือง,เขียว,ฟ้า,นํ้าตาล,ส้ม,เทา,ชมพู,ม่วง] '},

	{ pos:'noun', name:'@personJob',type:'list',value:['ผู้ช่วย','นัก เรียน','ช่าง เครื่อง','ชาว เขา','ชาว เล','คน ขาย','คนขับรถ'] },
	{ pos:'verb', name:'@verbSee',type:'list',value:['ดู','เห็น','หา','ได้ยิน','ฟัง'] },
	{ pos:'noun', name:'@mammal',type:'list',value:['หมา','ม้า','แมว','ยุง','วัว'] },
	{ pos:'noun', name:'@insect',type:'list',value:['หมา','ม้า','แมว','ยุง','วัว'] },
	{ pos:'adj',  name:'@adjmammal',type:'list',value:['ตัวใหญ่','ตัวเล็ก','สูง','เตี้ย','อ้วน','ผอม','เหนื่อย','ง่วง','เก่ง','ขี้เกียจ'] },
	{ pos:'adj',  name:'@adjinsect',type:'list',value:['ตัวใหญ่','ตัวเล็ก','อ้วน','ผอม','เหนื่อย','ง่วง','เก่ง','ขี้เกียจ'] },
	{ pos:'sentence',  name:'@expressions',type:'list',value:['เจอ กัน','พบ กัน','เช่น กัน','คุณ เป็น อย่าง ไร บ้าง','เป็น อย่าง ไร บ้าง','สบายดี','แลัวคุณล่ะ','เหนื่อย','คุณ ทาน ข้าว รึยัง ไหม','คุณ กิน ข้าว แล้ว ไหม','วันนี้ คุณ ทำ อะไร','วันนี้ คุณ ทำ อะไร บ้าง','อ่าน หนังสือ','ดู หนัง','นอนหลับ','วันนี้คุณจะทำอะไร','ผม จะ เดิน ไป ชุมชน สันติธรรม','ออกกำลังกาย','ผม สำรวจ และ สังเกต ระหว่าง','เดิน ออกกำลังกาย','คุณ ไป ที่ไหน','ไป ไหน','กลับ บ้าน','คุณ ไป ที่ไหน มา','ไป ไหน มา','ไป ไหน มา บ้าง','ห้าง','ห้าง เมย่า','ยินดี ที่ได้ ยิน เสียง ของ คุณ','ยินดี ที่ได้ เห็น คุณ','ยินดี ที่ได้ พบ คุณ','ยินดี ที่ได้ เจอ คุณ','ดีใจ ที่ได้ เห็น คุณ','ดีใจ ที่ได้ พบ คุณ','ดีใจ ที่ได้ เจอ คุณ','ฉัน ก็ เหมือน กัน','เช่น กัน','อะไร','ขอ ให้ มี วันที่ดี','แล้ว พบ กัน ใหม่','แล้ว เจอ กัน','แล้ว พบ กัน ภาย ใน ๑ ชั่วโมง','ลา ก่อน','โชคดี','เดินทาง โดย ปลอดภัย','เดิน ทาง ปลอด ภัย','ขับ ปลอดภัย','ขอให้ มี ความสุข วันหยุด สุดสัปดาห์','ดูแล ตัวเอง ด้วย','ราตรี สวัสดิ์','นอนหลับฝันดี','ฝันดี'] },

	{ pos:'sentence', name:'@meToo', type:'pattern', value:'[ฉัน,ผม] ด้วย'},
	{ pos:'sentence', name:'@seeYouLater', type:'pattern', value:'[,แล้ว] [เจอ,พบ] กัน ใหม่'},
	{ pos:'sentence', name:'@takeCare', type:'pattern', value:'ดูแล ตัวเอง ด้วย'},
	{ pos:'sentence', name:'@goodbye',type:'cat',value:['@seeYouLater','@takeCare'] },

	//{ pos:'',  name:'@expressionMeet',type:'pattern',value:'[เจอ,พบ,เช่น] กัน' },
	{ pos:'',  name:'@expressionsThai',type:'list',value:['การซักรีด','ผ้าเช็ดตัว','ผ้าเช็ดตัว หนึ่ง ผืน','ผ้าปูที่นอน หนึ่ง ผืน','ปลอกหมอน สอง ปลอก','ซัก เสื้อ ห้า ตัว','ซัก รีด เสื้อ สอง ตัว','กางเกง หนึ่ง ตัว','เดิน','เดินทาง','อาทิตย์หน้า (ผม) จะ ไป ทะเล','สัปดาห์หน้า (ผม) จะ ไป ทะเล','ผม จะ ไป วันศุกร์ (หน้า)','ผม จะ เที่ยว สิบ วัน','ผม จะ อยู่ สิบ วัน','ผม จะ กลับ วันที่ ยี่สิบเก้า ตุลาคม','เช่า','ค่าเช่า','ให้ เช่า','ห้อง เช่า','อพาร์ทเม้น ให้ เช่า','บ้านให้เช่า','คุณ มี ห้อง เช่า ไหม','ค่าเช่า เท่าไหร่','สองพันบาท ต่อ เดือน','ค่ามัดจำ เท่าไหร่','ผม ขอ ดู ห้อง ได้ไหม','มี ห้องน้ำ ใน ห้อง ไหม','มี น้ำ อุ่น ไหม','มี แอร์ ไหม','มี ไวไฟ ไหม','ผม ต้องการ เช่า ห้อง (สำหรับ) เดือน มีนาคม และ เมษายน','เริ่ม วันที่ หนึ่ง มีนาคม','ถึง สามสิบ เมษายน','ถึง สิ้น เดือน เมษายน','แล้ว พบ กัน ใหม่','แล้ว เจอ กัน','แล้ว พบ กัน ภาย ใน ๑ ชั่วโมง','ลา ก่อน','โชคดี','ขับ ปลอดภัย','เดินทาง ปลอดภัย','เดินทาง โดย ความปลอดภัย','ขอให้ มี ความสุข วันหยุด สุดสัปดาห์','ขอให้ มี ความสุข ใน วันหยุด','ดูแล ตัวเอง ด้วย','ราตรี สวัสดิ์','นอนหลับฝันดี','ฝันดี','นอนหลับ ฝันดี ราตรี สวัสดิ์'] },
	{ pos:'',  name:'@expressionsEng',type:'list',value:['laundry','towel (cloth wipe body)','one towel','one sheet','two pillowcases','Five shirts wash','Two shirts wash and iron','One pants','walk','travel','Next week I go to sea.','Next week I go to sea.','I leave on Friday (next).','I will travel for 10 days.','I will stay for 10 days.','I will come back on 29 Oct.','House for rent','You have room for rent?','How much per rent per month?','Two thousand baht per month.','How much security deposit?','Can I see the room?','private bathroom','hot shower','air con','wifi','I want to rent a room for March and April.','Start 1 March.','until 30 April.','Until end of april','Then see you next time.','Then see you later.','See you in one hour','Good bye','Good luck','drive safe','travel safe','Travel with safety','have a good weekend','Please have happiness in holiday','take care of yourself','Good night','Sleep, sweet dreams','Sweet dreams','Sleep, sweet dreams, good night'] },
	{ pos:'',  name:'@expressionsDifficultx',type:'list',value:['&number(1000,10000,500) per month','ดูแล ตัวเอง ด้วย','ลา ก่อน','ปลอดภัย','ขอให้ มี ความสุข วันหยุด สุดสัปดาห์','แล้ว พบ กัน ภาย ใน ๑ ชั่วโมง','มี น้ำ อุ่น ไหม','อพาร์ทเม้น ให้ เช่า','เดินทาง ปลอดภัย','ผม จะ กลับ วันที่ ยี่สิบเก้า ตุลาคม','เดินทาง โดย ความปลอดภัย','ค่ามัดจำ เท่าไหร่','ปลอกหมอน สอง ปลอก','สองพันบาท ต่อ เดือน','ขอให้ มี ความสุข ใน วันหยุด'] },
	{ pos:'',  name:'@expressionsDifficult',type:'list',value:['ดูแล ตัวเอง ด้วย','ลา ก่อน','ปลอดภัย','ขอให้ มี ความสุข วันหยุด สุดสัปดาห์','แล้ว พบ กัน ภาย ใน ๑ ชั่วโมง','มี น้ำ อุ่น ไหม','อพาร์ทเม้น ให้ เช่า','เดินทาง ปลอดภัย','ผม จะ กลับ วันที่ ยี่สิบเก้า ตุลาคม','เดินทาง โดย ความปลอดภัย','ค่ามัดจำ เท่าไหร่','ปลอกหมอน สอง ปลอก','สองพันบาท ต่อ เดือน','ขอให้ มี ความสุข ใน วันหยุด'] },
	{ pos:'',  name:'@expressionsNumbers',type:'list',value:['$number(1000,30000,500) ต่อ เดือน','ค่ามัดจำ $number(1000,30000,500) บาท'] },
	{ pos:'noun',  name:'@rentalPrice',type:'pattern',value:'$number(1000,30000,500) บาท ต่อ เดือน' },
	{ pos:'noun',  name:'@depositAmount',type:'pattern',value:'ค่ามัดจำ $number(1000,30000,500) บาท' },
	{ pos:'noun',  name:'@foodQuantities',type:'pattern',value:'[water,milk] $number(1,6,1) [bottle, glass]' },
	{ pos:'noun',  name:'@foodQuantities',type:'pattern',value:'[coffee,tea] $number(1,6,1) tuay' },
	{ pos:'', name:'@kingBus',type:'list',value:['อนุสาวรีย์ สาม กษัตริย์','สาม กษัตริย์','กษัตริย์ สาม พระองค์','กษัตริย์ มังราย','พระเจ้า มังราย','พระ','พระเจ้า อยู่หัว','พระเจ้า แผ่น ดิน','พระบาท สม เด็จ พระเจ้า อยู่ หัว','ลง','ลง รถ','ลง ที่ ไหน','ลง ที่ อนุสาวรีย์ สาม กษัตริย์','ไป ไหน','ไป ที่ วัดอุปคุต','ขึ้น','ขึ้น รถ','ขึ้น รถเมล์  ที่ ไหน','ขึ้น ที่ อนุสาวรีย์ สาม กษัตริย์','สถานี','สถานี ขน ส่ง อาเขต','สถานี ขน ส่ง ช้างเผือก','ขน ส่ง อาเขต','ขน ส่ง ช้างเผือก','สถานี รถไฟ','ป้ายรถเมล์'] },
	{ pos:'', name:'@placesChiangMai',type:'list',value:['สถานี ขน ส่ง อาเขต','สถานี ขน ส่ง ช้างเผือก','อนุสาวรีย์ สาม กษัตริย์','วัด อุปคุต','ตลาด สมเพชร'] },
	{ pos:'', name:'@whereYouGo',type:'list',value:['คุณไปที่ไหน','ไปที่ไหน','ไปไหน'] },
	{ pos:'', name:'@glasses',type:'list',value:['แว่น','แว่นสายตา','แว่นกันแดด','แว่นสายตาใกล้','แว่นสายตายาว','แว่นขยาย','ผม ใส่ แว่นสายตาใกล้','ผม ไม่ ใส่ แว่นสายตายาว','ไม่ ใส่ แว่นกันแดด เมื่อ ออกไป ข้างนอก','เมื่อ ออกไป ข้างนอก ไม่ ใส่ แว่นกันแดด','เมื่อ ออกไป ข้างนอก','เมื่อ อยู่ ข้างในบ้าน','เมื่อ ออกไป ข้างนอก จะ ใส่ หมวก','เมื่อ ออกไป ข้างนอก จะ สวม หมวก','เมื่อ ออกไป ข้างนอก จะ ไม่ ใส่ แว่นกันแดด ','เมื่อ ออกไป ข้างนอก จะ ใส่ เสื้อ แขน ยาว','แขน','ขา','ข่า','คอ','ขอ','ยาว','สั้น','กางเกง','ครีม','ครีมกันแดด','เมื่อ ออกไป ข้างนอก จะ ใส่ ครีมกันแดด','ไปด้วย','เมื่อ ออกไป ข้างนอก จะ เอา ร่ม ไปด้วย','ขอ สร้อยคอ','สร้อยคอ','กางเกง ขา สั้น','เสื้อ แขน สั้น','ถ้าฝนตกจะไม่ออกไปข้างนอก','ถ้าฝนตกจะอยู่ข้างใน','ถ้าฝนตกจะไปเอาร่ม','ถ้าฝนตกจะเอาร่มไปด้วย','ข้างหน้ามีรถขวางอยู่','ข้างหลังมีรถขวางอยู่','ข้างหลังไปไม่ได้','ข้างหลังบ้านมีสวนผลไม้','ข้างในบ้านภรรยาของผมกำล้งทำงานอยู่','ภรรยาของผมกำล้งทำงานอยู่ข้างในบ้าน','ข้างนอกฝนกำล้งตก','ข้างนอกร้อนมาก','ข้างบนเสียงดัง','ข้างบนขึ้นไปไม่ได้','ภรรยานั่งข้างข้างผม','ข้างข้างบ้านมีงานเลี้ยง','ภรรยาขอคุณอยู่ที่ไหน','ข้างหลัง','ข้างล่าง','ใต้','ใน','ตะวันออก','ตะวันตก','ตะวันลับขอบฟ้า','ตะวัน','ลับ','ขอบฟ้า','เหนือ'] },
	{ pos:'', name:'@cup',type:'list',value:['แขน','ขา','ข่า','คอ','ขอ','ยาว','สั้น','กางเกง','ไปด้วย','เมื่อ ออกไป ข้างนอก จะ เอา ร่ม ไปด้วย','ขอ สร้อยคอ','สร้อยคอ','กางเกง ขา สั้น','เสื้อ แขน สั้น','ถ้าฝนตกจะเอาร่มไปด้วย','ข้างหลัง','ข้างล่าง','ใต้','ใน','ตะวันออก','ตะวันตก','ตะวันลับขอบฟ้า','ตะวัน','ลับ','ขอบฟ้า','เหนือ','กระทง','ลอย','ลอย','ลอย กระทง','กระทง ลอย','กระทง ใหญ่','ส้อม','ช้อน','ส้อมช้อน','คัน','คู่','ส้อมช้อน หนึ่ง คู่','ส้อม หนึ่ง คัน','ช้อน หนึ่ง คัน','ซ้าย','ขวา','ส้อม ซ้าย','ช้อน ขวา','จาน','ชาม','ถ้วย','แก้ว','ขวด','ถุง','ใบ','หน้า','หลัง','บน','ใต้','ใน','นอก','นอกจาก','ยกเว้น','ข้าง','ข้างใน','ข้างนอก','ข้างข้าง','ช้อน อยู่ ด้าน ขวา ของ จาน','ส้อม อยู่ ด้าน ซ้าย ของ จาน','จาน อยู่ ระหว่าง ช้อน กับ ส้อม','จาน อยู่ กลาง ช้อน กับ ส้อม','จาน อยู่ ตรงกลาง ช้อน กับ ส้อม','ช้อน อยู่ ใน ชาม','ชาม อยู่ บน จาน','ชาม วาง บน จาน','ไม่ ได้ ไป ใต้','ได้ ใต้','ไป ใบ','ว่าง','วาง','ระวัง','ระหว่าง','ไหมใหม่ไม่ไหม้ไหม','ระวัง วาง ระหว่าง ผิด','สาย','ซ้าย','ใส่','ลา ก่อน','ไป ละ','ไป ก่อน','ลา ละ','กลับก่อน','ตื่นเช้า','หกโมงเช้า','หกโมง','หกโมงครึ่ง'] },
	{ pos:'', name:'@wear',type:'list',value:['ใส่','สวม'] },
	{ pos:'sentence', name:'@conditional',type:'pattern',value:'[ถ้าออกไปข้างนอก,เมื่อออกไปข้างนอก] [,จะ] [,ไม่] @wear [หมวก,แว่นกันแดด,เสื้อแขนยาว]' },
	{ pos:'sentence', name:'@tellAbout', type:'pattern', value:'@waaverb ว่า' },
	{ pos:'sentence', name:'@waFood', type:'pattern', value:'@person ว่า [สั่ง,ต้ม,ผัด] @food'},
	{ pos:'sentence', name:'@cookFood', type:'pattern', value:'[ญาติ,เด็ก,พี่,น้อง,หลาน] [ชาย,หญิง] [สั่ง,ต้ม,ผัด] @food'},
	{ pos:'sentence', name:'@cookMeat1', type:'pattern', value:'@person @auxverb @cook @meat'},
	{ pos:'sentence', name:'@cookMeat2', type:'pattern', value:'@meat @cook'},
	{ pos:'sentence', name:'@cookMeat3', type:'pattern', value:'@person @cook @meat'},
	{ pos:'sentence', name:'@meatPred', type:'pattern', value:'@meat @adjfood'},
	//{ pos:'sentence', name:'@roomPred', type:'pattern', value:'@room @color @adjroom'},
	// pattern nested within array { pos:'sentence', name:'@roomPred', type:'pattern', value:'[@room,@room_@color_@adjroom]'},
	{ pos:'sentence', name:'@food1', type:'pattern', value:'@meat @cook ต่อ เดือน'},
	{ pos:'sentence', name:'@food2', type:'pattern', value:'@person ว่า [สั่ง,ต้ม,ผัด] @food'},
	{ pos:'sentence', name:'@seeMammal', type:'pattern', value:'@personJob @verbSee @mammal @adjmammal'},
	{ pos:'sentence', name:'@seeInsect', type:'pattern', value:'@personJob @verbSee @insect @adjinsect'},
	{ pos:'sentence', name:'@room1', type:'pattern', value:'@roomType @adjroom'},
	{ pos:'sentence', name:'@room2', type:'pattern', value:'@roomType @color @adjroom'},
	{ pos:'sentence', name:'@person1', type:'pattern', value:'[ม้า,หมา] ของ @person เข้ามา'},
	//{ pos:'sentence', name:'@room2', type:'pattern', value:'@person ของ @person เข้ามา'},
	{ pos:'conversation',  name:'@whereYouGoConv',type:'pattern',value:'Q: @whereYouGo A: @placesChiangMai' },
	{ pos:'conversation',  name:'@howAreYou', type:'pattern', value:'Q: [,คุณ] เป็น อย่าง ไร บ้าง  A: [สบายดี,เหนื่อย] [,แลัวคุณล่ะ]' },
	{ pos:'sentence', name:'@rent1', type:'pattern', value:'$number(1000,30000,500) [,บาท] ต่อ เดือน'},
	{ pos:'sentence', name:'@rent2', type:'pattern', value:'ค่ามัดจำ $number(1000,30000,500) บาท'},
];
