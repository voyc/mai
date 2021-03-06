insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',1,1,'n','กระดาน','board','plank; deal; game board');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',1,1,'c','กว่า','more-than','[suffix used for comparisons] than; more; -er');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',1,1,'n','ดาว','star','star; a non-planetary celestial body; spot');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (400,2,'o',1,1,' ','ติด','','[of a person] to become (figuratively) fixated (on something); to think about (something) to an extreme and excessive degree; to be (figuratively) absorbed; to be obsessed (with someone or something); to be crazy or mad about; to be fascinated by');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',1,1,'j','สด','fresh','[is] fresh; green; not spoiled; new; newly produced or minted; raw; [colors] bright');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (400,2,'o',1,1,'n','สาว','girl','young woman; girl; unmarried woman; maiden; damsel; lass; lassie (informal); maid; virgin; wench');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (400,2,'o',1,1,'j','หก','six','six; the number or quantity six');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (400,2,'o',1,1,' ','หา','find','to find; look for; seek; to search');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (400,2,'o',1,1,' ','หาก','if','allowing that; if; despite; rather');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (400,2,'o',1,1,' ','หาด','beach','beach');

/*
select * from mai.thaidict where thai in ('กระดาน', 'กว่า', 'กา', 'ดาว', 'ติด', 'ทรง', 'ว่า', 'สด', 'สาว' 'หก', 'หา', 'หาก', 'หาด');


insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',2,1,'n','กา','mark','teapot-kettle with a spout, tick, sign or mark set against an item');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (400,2,'o',3,1,' ','ทรง','','hair style; hairdo');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',2,1,'c','ว่า','as','as');


psql -U voyccom_jhagstrand -d voyccom_mai -c "select id, type, numdef, pos, thai, eng, details from mai.thaidict where thai in ('กระดาน', 'กว่า', 'กา', 'ดาว', 'ติด', 'ทรง', 'ว่า', 'สด', 'สาว', 'หก', 'หา', 'หาก', 'หาด');"
Password for user voyccom_jhagstrand: 
  id  | type | numdef | pos | thai | eng  |                              details
                               
------+------+--------+-----+------+------+-------------------------------------
-------------------------------
  165 | o    |      2 | n   | กา   | mark | teapot-kettle with a spout, tick, si
gn or mark set against an item
  544 | o    |      3 |     | ทรง  |      | hair style; hairdo
 1067 | o    |      2 | c   | ว่า   | as   | as
  543 | o    |      1 |     | ทรง  |      | form; figure; style
(4 rows)

 1276 | ขม      |      1 | j   | bitter                | 
 1405 | ขม      |      1 | j   | bitter                | [is] bitter
  1385 | ขนม     |      1 | n   | cake                  | dessert made from rice flour
 1383 | ขนม     |      1 | n   | cake                  | dessert made from rice flour
  543 | ทรง     |      1 |     |                       | form; figure; style
  544 | ทรง     |      3 |     |                       | hair style; hairdo
  1386 | สมุด     |      1 | n   | notebook              | ledger, notebook, or directory
 1384 | สมุด     |      1 | n   | notebook              | ledger, notebook, or directory
*/
delete from mai.thaidict where id in (1405,1385,1386,544);
update mai.thaidict set pos='n', eng='form' where id = 543;
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',1,1,'v','กา','mark','to make a check-mark, X or cross marks');
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (300,2,'o',1,1,'v','ว่า','speak','to speak; say; aver; think');

