

psql -U voyccom_jhagstrand -d voyccom_mai -c "select * from mai.thaidict;"

/* insert new dict */
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ข่า', 'news', 'news; tidings; information received; message');

/* update type o */
update mai.thaidict set vowelpattern='o', leadingconsonant='อ', finalconsonant='ด', tonemark='', tone='L', translit=' ot', rules='ccivo,fnsc,mcd' where id = 1237;


