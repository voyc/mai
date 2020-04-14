
/* create mai.dict 13 April 2020 */
create table mai.dict (id,g,t,tl,tlm,cp,cpm,ru)
as
select id, type, thai, translit, 'a', components, 'a', rules 
from mai.thaidict where numdef=1 and (type = 'o' or type = 'm');"
SELECT 1232

alter table mai.dict 
	alter tlm type char(1),
	alter cpm type char(1),
	ADD PRIMARY KEY (id);
ALTER TABLE

/* create mai.mean 13 April 2020 */
create table mai.mean (
	id,did,n,s,l,p,e,d
)
as
select row_number() over(order by d.id), d.id, m.numdef, m.source, m.level, m.pos, m.eng, m.details
from mai.thaidict m, mai.thaidict d
where (m.type = 'o' or m.type = 'm')
and d.numdef = 1
and m.thai = d.thai;
SELECT 1367

alter table mai.mean
        alter p type varchar(9),
        ADD PRIMARY KEY (id);

update mai.dict set tl = tl || split_part(cp,',',5) where g='o';
UPDATE 815

-- example sql

-- review table information
select column_name, data_type, character_maximum_length
from INFORMATION_SCHEMA.COLUMNS where table_name = 'dict';
or
\d mai.dict

-- join dict and mean
select count(*)
from mai.mean m, mai.dict d
where m.did = d.id and m.n = 1;

-- show parsed syllable components
select split_part(cp,',',1) as leading_consonant,
split_part(cp,',',2) as vowel_pattern,
split_part(cp,',',3) as final_consonant,
split_part(cp,',',4) as tone_mark,
split_part(cp,',',5) as tone
from mai.dict
where g='o' limit 20;

/*
mai.dict components method
	run parse on all type o records
	if the result of the parse does not match the db
	then set cpm to 'm'
*/

/*
other tables, not in db, hardcoded in dictionary.js 
	alphabet
	vowel patterns

code tables, not in db, hardcoded in dictionary.js 
	pos
	rules
*/

