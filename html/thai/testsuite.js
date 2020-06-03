/**
	additions to Noam
	available only to superuser
**/
voyc.Noam.testSuiteParseSyllable = [
	// one test for each rule
	{tw:'ผม', cp:'ผ,o,ม,,R', ru:'ccivo,fsc,hcl', tl:'pomR', tp:'rule', value:'fsc'},
	{tw:'เล็ก', cp:'ล,เo็,ก,,H', ru:'fnsc,lcds', tl:'lekH', tp:'rule', value:'fnsc'},
	{tw:'ประ', cp:'ปร,oะ,,,L', ru:'ovs,mcd', tl:'bpraL', tp:'rule', value:'ovs'},
	{tw:'ไก่', cp:'ก,ไo,,่,L', ru:'ovl,mc1', tl:'gaiL', tp:'rule', value:'ovl'},
	{tw:'ดี', cp:'ด,oี,,,M', ru:'ovl,mcl', tl:'diiM', tp:'rule', value:'mcl'},
	{tw:'เป็ด', cp:'ป,เo็,ด,,L', ru:'fnsc,mcd', tl:'bpetL', tp:'rule', value:'mcd'},
	{tw:'ต่าง', cp:'ต,oา,ง,่,L', ru:'fsc,mc1', tl:'dtaangL', tp:'rule', value:'mc1'},
	{tw:'กุ้ง', cp:'ก,oุ,ง,้,F', ru:'fsc,mc2', tl:'gungF', tp:'rule', value:'mc2'},
	{tw:'โต๊ะ', cp:'ต,โoะ,,๊,H', ru:'ovs,mc3', tl:'dtoH', tp:'rule', value:'mc3'},
	{tw:'ตั๋ว', cp:'ต,oัว,,๋,R', ru:'ovl,mc4', tl:'dtuaR', tp:'rule', value:'mc4'},
	{tw:'หอย', cp:'ห,oอ,ย,,R', ru:'fsc,hcl', tl:'haawyR', tp:'rule', value:'hcl'},
	{tw:'เผ็ด', cp:'ผ,เo็,ด,,L', ru:'fnsc,hcd', tl:'petL', tp:'rule', value:'hcd'},
	{tw:'เหนื่อย', cp:'หน,เoือ,ย,่,L', ru:'cclh,fsc,hc1', tl:'nʉʉayL', tp:'rule', value:'hc1'},
	{tw:'ข้าว', cp:'ข,oา,ว,้,F', ru:'fsc,hc2', tl:'kaaoF', tp:'rule', value:'hc2'},
	{tw:'เชียง', cp:'ช,เoีย,ง,,M', ru:'fsc,lcl', tl:'chiiangM', tp:'rule', value:'lcl'},
	{tw:'เล็ก', cp:'ล,เo็,ก,,H', ru:'fnsc,lcds', tl:'lekH', tp:'rule', value:'lcds'},
	{tw:'ยาก', cp:'ย,oา,ก,,F', ru:'fnsc,lcdl', tl:'yaakF', tp:'rule', value:'lcdl'},
	{tw:'ว่าง', cp:'ว,oา,ง,่,F', ru:'fsc,lc1', tl:'waangF', tp:'rule', value:'lc1'},
	{tw:'เนื้อ', cp:'น,เoือ,,้,H', ru:'ovl,lc2', tl:'nʉʉaH', tp:'rule', value:'lc2'},

	// test for rule excp, exceptions to the tone rules	
	{tw:'ก็', cp:'ก,o็,,,F', ru:'ovl,excp', tl:'gaawF', tp:'rule', value:'excp'},
	
	//{ tl:'', tp:'rule', value:'cct'}, // true cluster
	
	//{ tl:'', tp:'rule', value:'ccf'}, // false cluster

	// tests for rule cclh, a cluster with leading ห
	{tw:'หมู', cp:'หม,oู,,,R', ru:'cclh,ovl,hcl', tl:'muuR', tp:'rule', value:'cclh'},
	{tw:'ไหว', cp:'หว,ไo,,,R', ru:'cclh,ovl,hcl', tl:'waiR', tp:'rule', value:'cclh'},
	{tw:'หวิว', cp:'หว,oิ,ว,,R', ru:'cclh,fsc,hcl', tl:'wioR', tp:'rule', value:'cclh'},
	{tw:'แหล่ะ',cp:'หล,แoะ,,่,L',ru:'cclh,ovs,hc1', tl:'laeL', tp:'rule', value:'cclh'},
	{tw:'ไหม้', cp:'หม,ไo,,้,F', ru:'cclh,ovl,hc2', tl:'maiF', tp:'rule', value:'cclh'},
	{tw:'ใหม่', cp:'หม,ใo,,่,L', ru:'cclh,ovl,hc1', tl:'maiL', tp:'rule', value:'cclh'},

	// tests for rule cclha, a cluster with leading อ, exactly four cases
	{tw:'อย่า',  cp:'อย,oา,,่,L',  ru:'cclha,ovl,hc1', tl:'yaaL', tp:'rule', value:'cclha'},
	{tw:'อยู่',   cp:'อย,oู,,่,L',   ru:'cclha,ovl,hc1', tl:'yuuL', tp:'rule', value:'cclha'},
	{tw:'อย่าง', cp:'อย,oา,ง,่,L',  ru:'cclha,fsc,hc1', tl:'yaangL', tp:'rule', value:'cclha'},
	{tw:'อยาก', cp:'อย,oา,ก,,L', ru:'cclha,fnsc,hcd',tl:'yaakL', tp:'rule', value:'cclha'},

	// tests for rule ccivo, inherent vowel short o
	{tw:'หมด', cp:'หม,o,ด,,L', ru:'ccivo,cclh,ovs,hcd', tl:'modL', tp:'rule', value:'ccivo'},
	//	{w:'ขม',m:'ขม',vp:'o',lc:'ข',fc:'ม',tm:'',tn:'R',tl:'kom',ru:'ccivo,fsc,hcl'},
	//	{w:'คม',m:'คม',vp:'o',lc:'ค',fc:'ม',tm:'',tn:'M',tl:'kom',ru:'ccivo,fsc,lcl'},
	//	{w:'ชม',m:'ชม',vp:'o',lc:'ช',fc:'ม',tm:'',tn:'M',tl:'chom',ru:'ccivo,fsc,lcl'},
	//	{w:'พจน์',m:'พจน',vp:'o',lc:'พจน',fc:'',tm:'',tn:'H',tl:'pjno',ru:'ovs,lcds'}, // ccivo ok

	// tests for rule cciva, inherent vowel short a 
	//	{ tl:'', tp:'rule', value:'cciva'},
	//	 คณะ |    | cciva
	//	 คณะ |    | cciva
	//	 ทวี  |    | cciva
	//	 ทวีป |    | cciva
	//	 สติ  |    | cciva
	//	 สระ |    | cciva
	//	 ขณะ |    | cciva
	//	 สมุด |    | cciva
	//	 ชนะ |    | cciva
	//	{w:'ฉกาจ',m:'ฉกา',vp:'oา',lc:'ฉก',fc:'',tm:'',tn:'R',tl:'chkgaa',ru:'ovl,hcl'}, // cciva faile
	//	อัศจรรย์

	// tests for rule ccive, inherent vowel enepenthetic, create multiple syllables
	// any difference between cciva and ccive?
	{tw:'เกษียณ', cp:'กษ,เoีย,ณ,,R', ru:'ccive,hcl,fsc', tl:'gsianM', tp:'rule', value:'ccive'},
	// กรกฎาคม cciva

	// tests for rule ccredup, reduplication, creates multiple syllables always fails
	//	 อัศจรรย์ |    | ccredup
	//	{w:'นัยนา', ru:'redup'},
	//	{w:'วิทยาลัย', ru:'redup'},
	//		นัยนา  นัย ย นา    ย used twice, Naiyana
	//		วิทยาลัย  วิท ท ยาลัย

	// tests for exceptions, rule 'exp'

	// tests for interesting combinations
	//	 ถนน |    | cciva,ccivo
	//	 ขนม |    | cciva,ccivo
	// พฤศจิกายน ccredup, cciva  November
	// พฤษภาคม ccredup, cciva  May
	// มกราคม ccredup, cciva  January


	// one test for each vowel pattern
	// select '{tw:''' || t || ''', cp:''' || cp || ''', ru:''' || ru || ''', tl:''' || tl || ''', tp:''vp'', value:''' || split_part(cp,',',2) || '''},', id from mai.dict where split_part(cp,',',2) = 'oะ' order by lvl limit 10;
	{tw:'กะ', cp:'ก,oะ,,,L', ru:'ovs,mcd', tl:'gaL', tp:'vp', value:'oะ'},
	{tw:'ดาว', cp:'ด,oา,ว,,M', ru:'fsc,mcl', tl:'daaoM', tp:'vp', value:'oา'},
	{tw:'งัด', cp:'ง,oั,ด,,H', ru:'fnsc,lcds', tl:'ngatH', tp:'vp', value:'oั'},
	{tw:'ชิม', cp:'ช,oิ,ม,,M', ru:'fsc,lcl', tl:'chimM', tp:'vp', value:'oิ'},
	{tw:'ตี', cp:'ต,oี,,,M', ru:'ovl,mcl', tl:'dtiiM', tp:'vp', value:'oี'},
	{tw:'จึง', cp:'จ,oึ,ง,,M', ru:'fsc,mcl', tl:'jʉngM', tp:'vp', value:'oึ'},
	{tw:'คืน', cp:'ค,oื,น,,M', ru:'fsc,lcl', tl:'kʉʉnM', tp:'vp', value:'oื'},
	{tw:'คือ', cp:'ค,oือ,,,M', ru:'ovl,lcl', tl:'kʉʉM', tp:'vp', value:'oือ'},
	{tw:'ลุง', cp:'ล,oุ,ง,,M', ru:'fsc,lcl', tl:'lungM', tp:'vp', value:'oุ'},
	{tw:'ลูบ', cp:'ล,oู,บ,,F', ru:'fnsc,lcdl', tl:'luupF', tp:'vp', value:'oู'},
	{tw:'โต๊ะ', cp:'ต,โoะ,,๊,H', ru:'ovs,mc3', tl:'dtoH', tp:'vp', value:'โoะ'},
	{tw:'โกรธ', cp:'กร,โo,ธ,,L', ru:'fnsc,mcd', tl:'grootL', tp:'vp', value:'โo'},
	{tw:'สด', cp:'ส,o,ด,,L', ru:'ccivo,fnsc,hcd', tl:'sotL', tp:'vp', value:'o'},
	// no example in dictonary for 'เoะ'
	{tw:'เขต', cp:'ข,เo,ต,,L', ru:'fnsc,hcd', tl:'ketL', tp:'vp', value:'เo'},
	{tw:'เย็น', cp:'ย,เo็,น,,M', ru:'fsc,lcl', tl:'yenM', tp:'vp', value:'เo็'},
	{tw:'แกะ', cp:'ก,แoะ,,,L', ru:'ovs,mcd', tl:'gaeL', tp:'vp', value:'แoะ'}, 
	{tw:'แกง', cp:'ก,แo,ง,,M', ru:'fsc,mcl', tl:'gaaengM', tp:'vp', value:'แo'},
	{tw:'แข็ง', cp:'ข,แo็,ง,,R', ru:'fsc,hcl', tl:'kaengR', tp:'vp', value:'แo็'},
	{tw:'เกาะ', cp:'ก,เoาะ,,,L', ru:'ovs,mcd', tl:'gawL', tp:'vp', value:'เoาะ'},
	{tw:'กอบ', cp:'ก,oอ,บ,,L', ru:'fnsc,mcd', tl:'gaawpL', tp:'vp', value:'oอ'},
	{tw:'ก็', cp:'ก,o็,,,F', ru:'ovl,excp', tl:'gaawF', tp:'vp', value:'o็'}, // only one example
	{tw:'เยอะ', cp:'ย,เoอะ,,,H', ru:'ovs,lcds', tl:'yöH', tp:'vp', value:'เoอะ'},
	{tw:'เธอ', cp:'ธ,เoอ,,,M', ru:'ovl,lcl', tl:'tööM', tp:'vp', value:'เoอ'},
	{tw:'เกิด', cp:'ก,เoิ,ด,,L', ru:'fnsc,mcd', tl:'götL', tp:'vp', value:'เoิ'},
	{tw:'เสีย', cp:'ส,เoีย,,,R', ru:'ovl,hcl', tl:'siiaR', tp:'vp', value:'เoีย'},
	{tw:'เดือด', cp:'ด,เoือ,ด,,L', ru:'fnsc,mcd', tl:'dʉʉatL', tp:'vp', value:'เoือ'},
	// no example in dictionary for 'oัวะ'
	{tw:'ตัว', cp:'ต,oัว,,,M', ru:'ovl,mcl', tl:'dtuaM', tp:'vp', value:'oัว'},
	{tw:'ขวด', cp:'ข,oว,ด,,L', ru:'fnsc,hcd', tl:'kuatL', tp:'vp', value:'oว'},
	{tw:'ไว', cp:'ว,ไo,,,M', ru:'ovl,lcl', tl:'waiM', tp:'vp', value:'ไo'},
	{tw:'ใจ', cp:'จ,ใo,,,M', ru:'ovl,mcl', tl:'jaiM', tp:'vp', value:'ใo'},
	{tw:'เมา', cp:'ม,เoา,,,M', ru:'ovl,lcl', tl:'maoM', tp:'vp', value:'เoา'},
	{tw:'คำ', cp:'ค,oำ,,,M', ru:'ovl,lcl', tl:'kamM', tp:'vp', value:'oำ'},
	{tw:'เลย', cp:'ล,เoย,,,M', ru:'ovl,lcl', tl:'löiM', tp:'vp', value:'เoย'},
	{tw:'วรรค', cp:'ว,oรร,ค,,H', ru:'fnsc,lcds', tl:'wakH', tp:'vp', value:'oรร'},

	// todo:
	// tests for exceptions for ร, รร, รรร
	// สรร - open rr, add n
	// สรรค์ - open rr, plus silent consonent
	// กร  excp gaawnM worker  open r add n ?
	// กรรม normal vowel รร, not a multi syllable กร รม - must be manual, or hardcoded exception in parseString
	// one test for each leading consonant
	// one test for each leading consonant cluster
	//	{w:'ครก',m:'ครก',vp:'o',lc:'คร',fc:'ก',tm:'',tn:'H',tl:'krok',ru:'ccivo,fnsc,lcds'},
	//	{w:'โครก',m:'โครก',vp:'โo',lc:'คร',fc:'ก',tm:'',tn:'F',tl:'krook',ru:'fnsc,lcdl'},
	//	{w:'กรง',m:'กรง',vp:'o',lc:'กร',fc:'ง',tm:'',tn:'M',tl:'grong',ru:'ccivo,fsc,mcl'},
	//	{w:'กร่าง',m:'กร่า',vp:'oา',lc:'กร',fc:'ง',tm:'่',tn:'L',tl:'graang',ru:'fsc,mc1'},
	//	{w:'โกร่ง',m:'โกร่',vp:'โo',lc:'กร',fc:'ง',tm:'่',tn:'L',tl:'groong',ru:'fsc,mc1'},
	//	{w:'ควร',m:'คว',vp:'oว',lc:'ค',fc:'ร',tm:'',tn:'M',tl:'kuan',ru:'fsc,lcl'},
	//	{w:'รูป',m:'รู',vp:'oู',lc:'ร',fc:'ป',tm:'',tn:'F',tl:'ruup',ru:'fnsc,lcdl'},
	//	{w:'หวิว',m:'หวิ',vp:'oิ',lc:'หว',fc:'ว',tm:'',tn:'R',tl:'wio',ru:'cclh,fsc,hcl'},
	//	{w:'ไหว',m:'ไหว',vp:'ไo',lc:'หว',fc:'',tm:'',tn:'R',tl:'wai',ru:'cclh,ovl,hcl'},
	// one test for each final consonant
	//	{w:'ศร',m:'ศร',vp:'o',lc:'ศ',fc:'ร',tm:'',tn:'R',tl:'saawn',ru:'ccivo,fsc,hcl'},
	// one test for each tonemark
	//	{w:'ก๊าก',m:'ก๊า',vp:'oา',lc:'ก',fc:'ก',tm:'๊',tn:'H',tl:'gaak',ru:'fnsc,mc3'},
	// one test for each example of a silent consonant
	// กุมภาพันธ์ February
];

/*
dictionary tests
 blank 10
 blank 9
 exp 1

tests for multi-syllable words
	{w:'ชำนาญ',m:'นา',vp:'oา',lc:'น',fc:'',tm:'',tn:'M',tl:'naa',ru:'ovl,lcl'}, // multi syllable
	{w:'คำนวณ',m:'นว',vp:'oว',lc:'น',fc:'',tm:'',tn:'M',tl:'nua',ru:'ovl,lcl'}, // multi syllable
*/

// run the test suite
voyc.Noam.prototype.test = function(cb) {
	var callback = cb;
	var s = '';
	var set = voyc.Noam.testSuiteParseSyllable;
	var ids = [];
	tstcnt = 0;
	errcnt = 0;
	for (var i=0; i<set.length; i++) {
		var tst = set[i];
		tstcnt++;
		var po = this.parseSyllable(tst.tw);
		if (po.cp == tst.cp && po.ru == tst.ru && po.tl == tst.tl)  {
			s += tst.tw + ' ok<br/>';
		}
		else {
			errcnt++;
			s += '<b>' + tst.tw + '</b> error<br/>';
			s += 'correct: ' + tst.cp + '; ' + tst.ru + '; ' + tst.tl + '<br/>';
			s += 'parser: ' + po.cp + '; ' + po.ru + '; ' + po.tl + '<br/>';
		}
	}
	s += 'complete. ' + tstcnt + ' tests, ' + errcnt + ' errors<br/>';
	callback(s);
}

// incomplete
voyc.Noam.prototype.testDict = function(cb) {
	var s = '';
	var set = voyc.Noam.testSuiteParseSyllable;
	var ids = [];
	for (var i=0; i<set.length; i++) {
		var id = parseInt(voyc.dictionary.fastMatch(set[i].tw).id);
		ids.push(id);
	}
	var self = this;
	var callback = cb;
	voyc.dictionary.getDict(ids,function() {
		for (var i=0; i<set.length; i++) {
			var po = self.parseSyllable(set[i].tw);
			var id = voyc.dictionary.fastMatch(set[i].tw).id;
			var dict = voyc.dictionary.miniDict(id);
			if (po.cp == dict.cp && po.ru == dict.ru && po.tl == dict.tl)  {
			}
			else {
				s += 'fail ' + dict.t + '<br/>';
				//s += 'old: ' + dict.cp + '; ' + dict.ru + '; ' + dict.tl + '<br/>';
				//s += 'new: ' + po.cp + '; ' + po.ru + '; ' + po.tl + '<br/>';
				s += 'correct: ' + tw.cp + '; ' + dict.ru + '; ' + dict.tl + '<br/>';
				s += 'parser: ' + po.cp + '; ' + po.ru + '; ' + po.tl + '<br/>';
			}
		}
		callback(s);
	});
}

