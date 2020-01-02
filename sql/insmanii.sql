/*
psql -U voyccom_jhagstrand -d voyccom_mai -f inshelo.sql
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ข่า', 'news', 'news; tidings; information received; message');
*/
/*
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ข่า', 'news', 'news; tidings; information received; message');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'อา', 'uncle', 'aunt or uncle, younger sister or brother of father');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ปู', 'crab', 'crab');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'e', 'ไว', 'quickly', 'swiftly; quickly');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'j', 'เทา', 'gray', 'is gray');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'v', 'ถู', 'scrub', 'to scrub; scour; wipe; polish; rub');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'กำ', 'profit', 'profit; gain');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'v', 'แบ', 'display', 'to display for all to see; to lay bare; to spread out');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'v', 'ชู', 'raise', 'to elevate; raise; lift; to hold something up high in one’s hand');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'โบ', 'ribbon', 'ribbon; bow');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'บัว', 'lotus', 'lotus; lotus-shaped');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'v', 'มาหา', 'come-visit', 'to (come) visit');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'n', 'มานี', 'Maanii', 'nickname, female');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'n', 'ชูใจ', 'Chujai', 'nickname, male');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'j', 'สีเทา', 'gray', 'the color gray');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'j', 'ดีใจ', 'happy', '[is] delighted; happy; glad; pleased');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'n', 'ปูนา', 'field-crab', 'field crab');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'j', 'สีดำ', 'black', 'black');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'm', 2, 1, 'n', 'ใบบัว', 'lotus-leaf', 'lotus leaf');
*/

/*อา */ update mai.thaidict set vowelpattern='oา', leadingconsonant='อ', finalconsonant='', tonemark='', tone='M', translit=' aa', rules='ovl,mcl' where id = 1439;
/*ปู */ update mai.thaidict set vowelpattern='oู', leadingconsonant='ป', finalconsonant='', tonemark='', tone='M', translit='bpuu', rules='ovl,mcl' where id = 1440;
/*ไว */ update mai.thaidict set vowelpattern='ไo', leadingconsonant='ว', finalconsonant='', tonemark='', tone='M', translit='wai', rules='ovl,lcl' where id = 1441;
/*เทา */ update mai.thaidict set vowelpattern='เoา', leadingconsonant='ท', finalconsonant='', tonemark='', tone='M', translit='tao', rules='ovl,lcl' where id = 1442;
/*ถู */ update mai.thaidict set vowelpattern='oู', leadingconsonant='ถ', finalconsonant='', tonemark='', tone='R', translit='tuu', rules='ovl,hcl' where id = 1443;
/*กำ */ update mai.thaidict set vowelpattern='oำ', leadingconsonant='ก', finalconsonant='', tonemark='', tone='M', translit='gam', rules='ovl,mcl' where id = 1444;
/*แบ */ update mai.thaidict set vowelpattern='แo', leadingconsonant='บ', finalconsonant='', tonemark='', tone='M', translit='baae', rules='ovl,mcl' where id = 1445;
/*ชู */ update mai.thaidict set vowelpattern='oู', leadingconsonant='ช', finalconsonant='', tonemark='', tone='M', translit='chuu', rules='ovl,lcl' where id = 1446;
/*โบ */ update mai.thaidict set vowelpattern='โo', leadingconsonant='บ', finalconsonant='', tonemark='', tone='M', translit='boo', rules='ovl,mcl' where id = 1447;
/*บัว */ update mai.thaidict set vowelpattern='oัว', leadingconsonant='บ', finalconsonant='', tonemark='', tone='M', translit='bua', rules='ovl,mcl' where id = 1448;
