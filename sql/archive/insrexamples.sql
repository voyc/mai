
/*
รัก
ราก
เรือ
หาร
ธาร
โจร
วรรค
กรรณ
ธรรม
สรร
พรรษา
บรรเทา
พร
กร
ศร
ละคร
โคจร
*/

/*
update mai.thaidict set details = 'dharma; religious teaching; religious duty; virtue; morality; precept; scruples; rightneousness; principles; doctrine; morals and ethics; the good and decent principles of life; truth; enlightenment; justice; fairness; rule; law; regulation;' where id = 604;
delete from mai.thaidict where id in (605,606,607,608,609);
update mai.thaidict set pos='n', eng='drama' where id = 1013;
update mai.thaidict set pos='v', eng='love' where id = 950;
update mai.thaidict set pos='n' where id = 957;
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'v', 'หาร', 'divide', 'mathematical division; to divide; divided by');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ธาร', 'creek', '[short for ลำธาร] stream; brook; creek');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'โจร', 'bandit', 'bandit; robber; thief; guerrilla');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'วรรค', 'paragraph-space', 'a space between phrases or sentences in Thai writing, used instead of punctuation');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'กรรณ', 'ear', 'ear');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'v', 'สรร', 'choose', 'to choose; to select; to elect; to prefer');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'n', 'พรรษา', 'rainy-season', 'rainy season; year');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'v', 'บรรเทา', 'ease', 'to ease; to alleviate; to moderate');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'พร', 'blessing', 'blessing; good wishes; benediction; favor');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ศร', 'arrow', 'arrow');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'v', 'โคจร', 'orbit', 'to orbit');
*/

/*
update mai.thaidict set vowelpattern='oั', leadingconsonant='ร', finalconsonant='ก', tonemark='', tone='H', translit='rak', rules='fnsc,lcds' where id = 950;
update mai.thaidict set vowelpattern='oา', leadingconsonant='ร', finalconsonant='ก', tonemark='', tone='F', translit='raak', rules='fnsc,lcdl' where id = 957;
update mai.thaidict set vowelpattern='เoือ', leadingconsonant='ร', finalconsonant='', tonemark='', tone='M', translit='rʉʉa', rules='ovl,lcl' where id = 988;
update mai.thaidict set vowelpattern='oา', leadingconsonant='ห', finalconsonant='ร', tonemark='', tone='R', translit='haan', rules='fsc,hcl' where id = 1412;
update mai.thaidict set vowelpattern='oา', leadingconsonant='ธ', finalconsonant='ร', tonemark='', tone='M', translit='taan', rules='fsc,lcl' where id = 1413;
update mai.thaidict set vowelpattern='โo', leadingconsonant='จ', finalconsonant='ร', tonemark='', tone='M', translit='joon', rules='fsc,mcl' where id = 1414;
*/

update mai.thaidict set vowelpattern='oรร', leadingconsonant='ว', finalconsonant='ค', tonemark='', tone='H', translit='wak', rules='fnsc,lcds' where id = 1415;
update mai.thaidict set vowelpattern='oรร', leadingconsonant='ก', finalconsonant='ณ', tonemark='', tone='M', translit='gan', rules='fsc,mcl' where id = 1416;
update mai.thaidict set vowelpattern='oรร', leadingconsonant='ธ', finalconsonant='ม', tonemark='', tone='M', translit='tam', rules='fsc,lcl' where id = 604;
update mai.thaidict set vowelpattern='oรร', leadingconsonant='ส', finalconsonant='', tonemark='', tone='R', translit='san', rules='ovs,hcl' where id = 1417;
update mai.thaidict set vowelpattern='o', leadingconsonant='พ', finalconsonant='ร', tonemark='', tone='M', translit='paawn', rules='ccivo,fsc,lcl' where id = 1420;
update mai.thaidict set vowelpattern='o', leadingconsonant='ก', finalconsonant='ร', tonemark='', tone='M', translit='gaawn', rules='ccivo,fsc,mcl' where id = 131;
update mai.thaidict set vowelpattern='o', leadingconsonant='ศ', finalconsonant='ร', tonemark='', tone='R', translit='saawn', rules='ccivo,fsc,hcl' where id = 1421;

