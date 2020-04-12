/*
psql -U voyccom_jhagstrand -d voyccom_mai -f inshelo.sql
insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'n', 'ข่า', 'news', 'news; tidings; information received; message');

psql -U voyccom_jhagstrand -d voyccom_mai -c "insert into mai.thaidict (level, source, type, numsyllables, numdef, pos, thai, eng, details) values (500, 1, 'o', 1, 1, 'v', 'เจอ', 'meet', 'to encounter; to meet or see (someone)');"

*/
