voyc.testSuite = [
	// one test word for each of 28 rules
	{tw:'ผม', cp:'ผ,o,ม,,R', ru:'ccivo,fsc,hcl', tp:'rule', value:'fsc'};
        {tw:'เล็ก', cp:'ล,เo็,ก,,H', ru:'fnsc,lcds', tp:'rule', value:'fnsc'},
        {tw:'ประ', cp:'ปร,oะ,,,L', ru:'ovs,mcd', tp:'rule', value:'ovs'},
        {tw:'ไก่', cp:'ก,ไo,,่,L', ru:'ovl,mc1', tp:'rule', value:'ovl'},
        {tw:'ดี', cp:'ด,oี,,,M', ru:'ovl,mcl', tp:'rule', value:'mcl'},
        {tw:'เป็ด', cp:'ป,เo็,ด,,L', ru:'fnsc,mcd', tp:'rule', value:'mcd'},
        {tw:'ต่าง', cp:'ต,oา,ง,่,L', ru:'fsc,mc1', tp:'rule', value:'mc1'},
        {tw:'กุ้ง', cp:'ก,oุ,ง,้,F', ru:'fsc,mc2', tp:'rule', value:'mc2'},
        {tw:'โต๊ะ', cp:'ต,โoะ,,๊,H', ru:'ovs,mc3', tp:'rule', value:'mc3'},
        {tw:'ตั๋ว', cp:'ต,oัว,,๋,R', ru:'ovl,mc4', tp:'rule', value:'mc4'},
        {tw:'หอย', cp:'ห,oอ,ย,,R', ru:'fsc,hcl', tp:'rule', value:'hcl'},
        {tw:'เผ็ด', cp:'ผ,เo็,ด,,L', ru:'fnsc,hcd', tp:'rule', value:'hcd'},
        {tw:'เหนื่อย', cp:'หน,เoือ,ย,่,L', ru:'cclh,fsc,hc1', tp:'rule', value:'hc1'},
        {tw:'ข้าว', cp:'ข,oา,ว,้,F', ru:'fsc,hc2', tp:'rule', value:'hc2'},
        {tw:'เชียง', cp:'ช,เoีย,ง,,M', ru:'fsc,lcl', tp:'rule', value:'lcl'},
        {tw:'เล็ก', cp:'ล,เo็,ก,,H', ru:'fnsc,lcds', tp:'rule', value:'lcds'},
        {tw:'ยาก', cp:'ย,oา,ก,,F', ru:'fnsc,lcdl', tp:'rule', value:'lcdl'},
        {tw:'ว่าง', cp:'ว,oา,ง,่,F', ru:'fsc,lc1', tp:'rule', value:'lc1'},
        {tw:'เนื้อ', cp:'น,เoือ,,้,H', ru:'ovl,lc2', tp:'rule', value:'lc2'},
        {tw:'ก็', cp:'ก,o็,,,F', ru:'exp', tp:'rule', value:'exp'},
        //{ tp:'rule', value:'cct'},
        //{ tp:'rule', value:'ccf'},
        {tw:'หมู', cp:'หม,oู,,,R', ru:'cclh,ovl,hcl', tp:'rule', value:'cclh'},
        {tw:'อยาก', cp:'อย,oา,ก,,L', ru:'cclha,fnsc,mcd', tp:'rule', value:'cclha'},
        //{ tp:'rule', value:'ccredup'},
        {tw:'หมด', cp:'หม,o,ด,,L', ru:'ccivo,cclh,ovs,hcd', tp:'rule', value:'ccivo'},
        //{ tp:'rule', value:'cciva'},
        {tw:'เกษียณ', cp:'กษ,เoีย,ณ,,R', ru:'ccive,hcl,fsc', tp:'rule', value:'ccive'},

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
];
