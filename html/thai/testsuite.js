voyc.Noam.testSuiteParseSyllable = [
	// one test word for each of 28 rules
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
        {tw:'เชียง', cp:'ช,เoีย,ง,,M', ru:'fsc,lcl', tl:'chiangM', tp:'rule', value:'lcl'},
        {tw:'เล็ก', cp:'ล,เo็,ก,,H', ru:'fnsc,lcds', tl:'lekH', tp:'rule', value:'lcds'},
        {tw:'ยาก', cp:'ย,oา,ก,,F', ru:'fnsc,lcdl', tl:'yaakF', tp:'rule', value:'lcdl'},
        {tw:'ว่าง', cp:'ว,oา,ง,่,F', ru:'fsc,lc1', tl:'waangF', tp:'rule', value:'lc1'},
        {tw:'เนื้อ', cp:'น,เoือ,,้,H', ru:'ovl,lc2', tl:'nʉʉaH', tp:'rule', value:'lc2'},
        {tw:'ก็', cp:'ก,o็,,,F', ru:'exp', tl:'gaawF', tp:'rule', value:'exp'},
        //{ tl:'', tp:'rule', value:'cct'},
        //{ tl:'', tp:'rule', value:'ccf'},
        {tw:'หมู', cp:'หม,oู,,,R', ru:'cclh,ovl,hcl', tl:'muuR', tp:'rule', value:'cclh'},
        {tw:'อยาก', cp:'อย,oา,ก,,L', ru:'cclha,fnsc,mcd', tl:'yaakL', tp:'rule', value:'cclha'},
        //{ tl:'', tp:'rule', value:'ccredup'},
        {tw:'หมด', cp:'หม,o,ด,,L', ru:'ccivo,cclh,ovs,hcd', tl:'modL', tp:'rule', value:'ccivo'},
        //{ tl:'', tp:'rule', value:'cciva'},
        {tw:'เกษียณ', cp:'กษ,เoีย,ณ,,R', ru:'ccive,hcl,fsc', tl:'gsianM', tp:'rule', value:'ccive'},
];

/*
 blank 10
 blank 9
 exp 1

 อัศจรรย์ |    | ccredup

 คณะ |    | cciva
 คณะ |    | cciva
 ถนน |    | cciva,ccivo
 ทวี  |    | cciva
 ทวีป |    | cciva
 สติ  |    | cciva
 สระ |    | cciva
 ขนม |    | cciva,ccivo
 ขณะ |    | cciva
 สมุด |    | cciva
 ชนะ |    | cciva
*/
	// one test word for each leading consonant

	// one test word for each vowel pattern

	// one test word for each final consonant

	// one test word for each tonemark
/*
    Test Set for parseSyllable()
*/
voyc.xparseSyllableTestSet = [
	{w:'กรอก',m:'กรอ',vp:'oอ',lc:'กร',fc:'ก',tm:'',tn:'L',tl:'graawk',ru:'fnsc,mcd'},
	{w:'ก๊าก',m:'ก๊า',vp:'oา',lc:'ก',fc:'ก',tm:'๊',tn:'H',tl:'gaak',ru:'fnsc,mc3'},
	{w:'กิ๊ก',m:'กิ๊',vp:'oิ',lc:'ก',fc:'ก',tm:'๊',tn:'H',tl:'gik',ru:'fnsc,mc3'},
	{w:'ครก',m:'ครก',vp:'o',lc:'คร',fc:'ก',tm:'',tn:'H',tl:'krok',ru:'ccivo,fnsc,lcds'},
	{w:'คราก',m:'ครา',vp:'oา',lc:'คร',fc:'ก',tm:'',tn:'F',tl:'kraak',ru:'fnsc,lcdl'},
	{w:'โครก',m:'โครก',vp:'โo',lc:'คร',fc:'ก',tm:'',tn:'F',tl:'krook',ru:'fnsc,lcdl'},
	{w:'กรง',m:'กรง',vp:'o',lc:'กร',fc:'ง',tm:'',tn:'M',tl:'grong',ru:'ccivo,fsc,mcl'},
	{w:'กร่าง',m:'กร่า',vp:'oา',lc:'กร',fc:'ง',tm:'่',tn:'L',tl:'graang',ru:'fsc,mc1'},
	{w:'โกร่ง',m:'โกร่',vp:'โo',lc:'กร',fc:'ง',tm:'่',tn:'L',tl:'groong',ru:'fsc,mc1'},
	{w:'แกง',m:'แกง',vp:'แo',lc:'ก',fc:'ง',tm:'',tn:'M',tl:'gaaeng',ru:'fsc,mcl'},
	{w:'งัด',m:'งั',vp:'oั',lc:'ง',fc:'ด',tm:'',tn:'H',tl:'ngat',ru:'fnsc,lcds'},
	{w:'งด',m:'งด',vp:'o',lc:'ง',fc:'ด',tm:'',tn:'H',tl:'ngot',ru:'ccivo,fnsc,lcds'},
	{w:'ผลาญ',m:'ผลา',vp:'oา',lc:'ผล',fc:'ญ',tm:'',tn:'R',tl:'plaan',ru:'fsc,hcl'},
	{w:'ชาญ',m:'ชา',vp:'oา',lc:'ช',fc:'ญ',tm:'',tn:'M',tl:'chaan',ru:'fsc,lcl'},
	{w:'ควร',m:'คว',vp:'oว',lc:'ค',fc:'ร',tm:'',tn:'M',tl:'kuan',ru:'fsc,lcl'},
	{w:'ก้าน',m:'ก้า',vp:'oา',lc:'ก',fc:'น',tm:'้',tn:'F',tl:'gaan',ru:'fsc,mc2'},
	{w:'รูป',m:'รู',vp:'oู',lc:'ร',fc:'ป',tm:'',tn:'F',tl:'ruup',ru:'fnsc,lcdl'},
	{w:'ลูบ',m:'ลู',vp:'oู',lc:'ล',fc:'บ',tm:'',tn:'F',tl:'luup',ru:'fnsc,lcdl'},
	{w:'ลาบ',m:'ลา',vp:'oา',lc:'ล',fc:'บ',tm:'',tn:'F',tl:'laap',ru:'fnsc,lcdl'},
	{w:'ลาภ',m:'ลา',vp:'oา',lc:'ล',fc:'ภ',tm:'',tn:'F',tl:'laap',ru:'fnsc,lcdl'},
	{w:'กาม',m:'กา',vp:'oา',lc:'ก',fc:'ม',tm:'',tn:'M',tl:'gaam',ru:'fsc,mcl'},
	{w:'ขม',m:'ขม',vp:'o',lc:'ข',fc:'ม',tm:'',tn:'R',tl:'kom',ru:'ccivo,fsc,hcl'},
	{w:'คม',m:'คม',vp:'o',lc:'ค',fc:'ม',tm:'',tn:'M',tl:'kom',ru:'ccivo,fsc,lcl'},
	{w:'ชม',m:'ชม',vp:'o',lc:'ช',fc:'ม',tm:'',tn:'M',tl:'chom',ru:'ccivo,fsc,lcl'},
	{w:'ชิม',m:'ชิ',vp:'oิ',lc:'ช',fc:'ม',tm:'',tn:'M',tl:'chim',ru:'fsc,lcl'},
	{w:'กาย',m:'กา',vp:'oา',lc:'ก',fc:'ย',tm:'',tn:'M',tl:'gaay',ru:'fsc,mcl'},
	{w:'ก่าย',m:'ก่า',vp:'oา',lc:'ก',fc:'ย',tm:'่',tn:'L',tl:'gaay',ru:'fsc,mc1'},
	{w:'ขาย',m:'ขา',vp:'oา',lc:'ข',fc:'ย',tm:'',tn:'R',tl:'kaay',ru:'fsc,hcl'},
	{w:'ข่า',m:'ข่า',vp:'oา',lc:'ข',fc:'',tm:'่',tn:'L',tl:'kaa',ru:'ovl,hc1'},
	{w:'แก้ว',m:'แก้',vp:'แo',lc:'ก',fc:'ว',tm:'้',tn:'F',tl:'gaaeo',ru:'fsc,mc2'},
	{w:'หวิว',m:'หวิ',vp:'oิ',lc:'หว',fc:'ว',tm:'',tn:'R',tl:'wio',ru:'cclh,fsc,hcl'},
	{w:'ไหว',m:'ไหว',vp:'ไo',lc:'หว',fc:'',tm:'',tn:'R',tl:'wai',ru:'cclh,ovl,hcl'},
	{w:'วรรค',m:'วรร',vp:'oรร',lc:'ว',fc:'ค',tm:'',tn:'H',tl:'wak',ru:'fnsc,lcds'},
	{w:'ธรรม',m:'ธรร',vp:'oรร',lc:'ธ',fc:'ม',tm:'',tn:'M',tl:'tam',ru:'fsc,lcl'},
	{w:'สรร',m:'สรร',vp:'oรร',lc:'ส',fc:'',tm:'',tn:'R',tl:'san',ru:'ovs,hcl'},
	{w:'พร',m:'พร',vp:'o',lc:'พ',fc:'ร',tm:'',tn:'M',tl:'paawn',ru:'ccivo,fsc,lcl'},
	{w:'ศร',m:'ศร',vp:'o',lc:'ศ',fc:'ร',tm:'',tn:'R',tl:'saawn',ru:'ccivo,fsc,hcl'},
];

/*
	reduplication creates multiple syllables
	examples of reduplication
			นัยนา  นัย ย นา    ย used twice, Naiyana
			วิทยาลัย  วิท ท ยาลัย
	{w:'ฉกาจ',m:'ฉกา',vp:'oา',lc:'ฉก',fc:'',tm:'',tn:'R',tl:'chkgaa',ru:'ovl,hcl'},
	{w:'พจน์',m:'พจน',vp:'o',lc:'พจน',fc:'',tm:'',tn:'H',tl:'pjno',ru:'ovs,lcds'},
	{w:'นัยนา', ru:'redup'},
	{w:'วิทยาลัย', ru:'redup'},
	{w:'ชำนาญ',m:'นา',vp:'oา',lc:'น',fc:'',tm:'',tn:'M',tl:'naa',ru:'ovl,lcl'},
	{w:'คำนวณ',m:'นว',vp:'oว',lc:'น',fc:'',tm:'',tn:'M',tl:'nua',ru:'ovl,lcl'},
*/

// display results of dictionary test
voyc.Noam.prototype.drawTestResult = function(m,t) {
	var format = document.getElementById("js").checked;
	var s = '';
	var dif = '';
	if (t) {
		if (t.vp!=m.vp) dif += 'vp';
		if (t.lc!=m.lc) dif += 'lc';
		if (t.fc!=m.fc) dif += 'fc';
		if (t.tm!=m.tm) dif += 'tm';
		if (t.tn!=m.tn) dif += 'tn';
		if (t.tl!=m.tl) dif += 'tl';
		if (t.ru!=m.ru.join()) dif += 'ru';
		if (t.m==m.m && t.vp==m.vp && t.lc==m.lc && t.fc==m.fc && t.tm==m.tm && t.tn==m.tn && t.tl==m.tl && t.ru==m.ru.join()) {
			s += '/*same&nbsp;';
		}
		else {
			s += '/*diff'+dif+'&nbsp;';
		}
	}
	else {
		s += '/*';
	}
	if (format) {
		s += "*/{t:'"+m.t+"',m:'"+m.m+"',vp:'"+m.vp+"',lc:'"+m.lc+"',fc:'"+m.fc+"',tm:'"+m.tm+"',tn:'"+m.tn+"',tl:'"+m.tl+"',ru:'"+m.ru.join()+"'}";
	}
	else {
		s += m.t+" */ update mai.thaidict set vowelpattern='"+m.vp+"', leadingconsonant='"+m.lc+"', finalconsonant='"+m.fc+"', tonemark='"+m.tm+"', tone='"+m.tn+"', translit='"+m.tl+"', rules='"+m.ru.join()+"' where id = " + m.id + ";"; 
	}
	return s;
}

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
			s += 'actual: ' + po.cp + '; ' + po.ru + '; ' + po.tl + '<br/>';
		}
	}
	s += 'complete. ' + tstcnt + ' tests, ' + errcnt + ' errors<br/>';
	callback(s);
}

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
				s += 'actual: ' + po.cp + '; ' + po.ru + '; ' + po.tl + '<br/>';
			}
		}
		callback(s);
	});
}

