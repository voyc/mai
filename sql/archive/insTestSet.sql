/*
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'กรอก', 'shape', 'shape; form; contour; appearance; similarity-to');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'ก๊าก', 'guffaw', 'a guffaw sound');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'กิ๊ก', 'laugh', '[a slight short sound of laughter in the throat]');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'ครก', 'mortar-weapon', 'mortar (with a สาก ); mortar (weapon)');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'คราก', 'expand', '[as a hole] to become larger from wear, to separate or part');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'โครก', 'snore', '[a snoring sound]');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'กรง', 'cage', 'cage; coop; a pen where you keep small animals or birds such as chickens and rabbits');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'กร่าง', 'swagger', 'to swagger'); 
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'แกง', 'curry', 'Thai style curry (can be with or without coconut milk)');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'งัด', 'pry', 'to pry open with a crowbar or lever');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'งด', 'stop', 'to stop; to cancel; to rescind; to halt; to interrupt; to cease');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'ผลาญ', 'waste', 'to consume excessively; run through (e.g. money); to waste');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'j', 'ชาญ', 'skilled', '[is] skilled; proficient');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'ก้าน', 'stem', 'stem; stalk; rod');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'ลูบ', 'caress', 'to caress; stroke; pet');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'ลาบ', 'minced-meat', 'Thai salad of diced meat served at room temperature; ground meat; chopped meat; minced meat');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'ลาภ', 'windfall', 'windfall; unexpected gain');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'n', 'กาม', 'sexual-desire', 'sexual desire; sex drive; eroticism; carnal lust');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'j', 'ขม', 'bitter', '[is] bitter');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'j', 'คม', 'sharp', '[is] sharp, not dull, not blunt');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'ชิม', 'taste', 'to taste');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'ก่าย', 'stack', 'to stack; pile things up; rest one thing on another');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'หวิว', 'feel-dizzy', 'dizzy; to feel dizzy');
insert into mai.thaidict (level, source, type, numsyllables, pos, thai, eng, details) values (500, 1, 'o', 1, 'v', 'ไหว', 'tremble', 'to shake; tremble; quake; quiver');
update mai.thaidict set numdef = 1 where numdef is null;
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ข่า', 'news', 'news; tidings; information received; message');
*/

/*
กาย  168
แก้ว  205
โกร่ง 207
ขาย  253
ขม  1276
ควร  294
ชม   385
รูป   979
*/
/* กรอก */ update mai.thaidict set vowelpattern='oอ', leadingconsonant='กร', finalconsonant='ก', tonemark='', tone='L', translit='graawk', rules='fnsc,mcd' where id = 1387;
/* ก๊าก */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ก', finalconsonant='ก', tonemark='๊', tone='H', translit='gaak', rules='fnsc,mc3' where id = 1388;
/* กิ๊ก */ update mai.thaidict set vowelpattern='oิ', leadingconsonant='ก', finalconsonant='ก', tonemark='๊', tone='H', translit='gik', rules='fnsc,mc3' where id = 1389;
/* ครก */ update mai.thaidict set vowelpattern='o', leadingconsonant='คร', finalconsonant='ก', tonemark='', tone='H', translit='krok', rules='ccivo,fnsc,lcds' where id = 1390;
/* คราก */ update mai.thaidict set vowelpattern='oา', leadingconsonant='คร', finalconsonant='ก', tonemark='', tone='F', translit='kraak', rules='fnsc,lcdl' where id = 1391;
/* โครก */ update mai.thaidict set vowelpattern='โo', leadingconsonant='คร', finalconsonant='ก', tonemark='', tone='F', translit='krook', rules='fnsc,lcdl' where id = 1392;
/* กรง */ update mai.thaidict set vowelpattern='o', leadingconsonant='กร', finalconsonant='ง', tonemark='', tone='M', translit='grong', rules='ccivo,fsc,mcl' where id = 1393;
/* กร่าง */ update mai.thaidict set vowelpattern='oา', leadingconsonant='กร', finalconsonant='ง', tonemark='่', tone='L', translit='graang', rules='fsc,mc1' where id = 1394;
/* โกร่ง */ update mai.thaidict set vowelpattern='โo', leadingconsonant='กร', finalconsonant='ง', tonemark='่', tone='L', translit='groong', rules='fsc,mc1' where id = 207;
/* แกง */ update mai.thaidict set vowelpattern='แo', leadingconsonant='ก', finalconsonant='ง', tonemark='', tone='M', translit='gaaeng', rules='fsc,mcl' where id = 1395;
/* งัด */ update mai.thaidict set vowelpattern='oั', leadingconsonant='ง', finalconsonant='ด', tonemark='', tone='H', translit='ngat', rules='fnsc,lcds' where id = 1396;
/* งด */ update mai.thaidict set vowelpattern='o', leadingconsonant='ง', finalconsonant='ด', tonemark='', tone='H', translit='ngot', rules='ccivo,fnsc,lcds' where id = 1397;
/* ผลาญ */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ผล', finalconsonant='ญ', tonemark='', tone='R', translit='plaan', rules='fsc,hcl' where id = 1398;
/* ชาญ */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ช', finalconsonant='ญ', tonemark='', tone='M', translit='chaan', rules='fsc,lcl' where id = 1399;
/* ควร */ update mai.thaidict set vowelpattern='oว', leadingconsonant='ค', finalconsonant='ร', tonemark='', tone='M', translit='kuan', rules='fsc,lcl' where id = 294;
/* ก้าน */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ก', finalconsonant='น', tonemark='้', tone='F', translit='gaan', rules='fsc,mc2' where id = 1400;
/* รูป */ update mai.thaidict set vowelpattern='oู', leadingconsonant='ร', finalconsonant='ป', tonemark='', tone='F', translit='ruup', rules='fnsc,lcdl' where id = 979;
/* ลูบ */ update mai.thaidict set vowelpattern='oู', leadingconsonant='ล', finalconsonant='บ', tonemark='', tone='F', translit='luup', rules='fnsc,lcdl' where id = 1401;
/* ลาบ */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ล', finalconsonant='บ', tonemark='', tone='F', translit='laap', rules='fnsc,lcdl' where id = 1402;
/* ลาภ */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ล', finalconsonant='ภ', tonemark='', tone='F', translit='laap', rules='fnsc,lcdl' where id = 1403;
/* กาม */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ก', finalconsonant='ม', tonemark='', tone='M', translit='gaam', rules='fsc,mcl' where id = 1404;
/* ขม */ update mai.thaidict set vowelpattern='o', leadingconsonant='ข', finalconsonant='ม', tonemark='', tone='R', translit='kom', rules='ccivo,fsc,hcl' where id = 1405;
/* คม */ update mai.thaidict set vowelpattern='o', leadingconsonant='ค', finalconsonant='ม', tonemark='', tone='M', translit='kom', rules='ccivo,fsc,lcl' where id = 1406;
/* ชม */ update mai.thaidict set vowelpattern='o', leadingconsonant='ช', finalconsonant='ม', tonemark='', tone='M', translit='chom', rules='ccivo,fsc,lcl' where id = 385;
/* ชิม */ update mai.thaidict set vowelpattern='oิ', leadingconsonant='ช', finalconsonant='ม', tonemark='', tone='M', translit='chim', rules='fsc,lcl' where id = 1407;
/* กาย */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ก', finalconsonant='ย', tonemark='', tone='M', translit='gaay', rules='fsc,mcl' where id = 168;
/* ก่าย */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ก', finalconsonant='ย', tonemark='่', tone='L', translit='gaay', rules='fsc,mc1' where id = 1408;
/* ขาย */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ข', finalconsonant='ย', tonemark='', tone='R', translit='kaay', rules='fsc,hcl' where id = 253;
/* ข่า */ update mai.thaidict set vowelpattern='oา', leadingconsonant='ข', finalconsonant='', tonemark='่', tone='L', translit='kaa', rules='ovl,hc1' where id = 1411;
/* แก้ว */ update mai.thaidict set vowelpattern='แo', leadingconsonant='ก', finalconsonant='ว', tonemark='้', tone='F', translit='gaaeo', rules='fsc,mc2' where id = 205;
/* หวิว */ update mai.thaidict set vowelpattern='oิ', leadingconsonant='หว', finalconsonant='ว', tonemark='', tone='R', translit='wio', rules='cclh,fsc,hcl' where id = 1409;
/* ไหว */ update mai.thaidict set vowelpattern='ไo', leadingconsonant='หว', finalconsonant='', tonemark='', tone='R', translit='wai', rules='cclh,ovl,hcl' where id = 1410;
