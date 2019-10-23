/* drop schema mai cascade; */
create schema mai;

create table mai.profile (
	id serial primary key,
	userid integer,
	displayname varchar(50),
	gender char(1),
	photo varchar(250),
	phone varchar(20)
);

create table mai.vocab (
	id serial primary key,
	userid integer,
	language char(2),
	type char(1),
	word varchar(100),
	state char(1),
	recency bigint,
	mastery integer
);

create table mai.thaidict (
	id serial primary key,
	type char(1),        /* g */ 
	thai varchar(100),   /* t */
	source int,          /* s */
	level int,           /* l */
	numdef int,          /* n */
	pos char(1),         /* p */
	eng varchar(100),    /* e */
	details varchar(500),/* d */
	
	/* glyph */
	unicode char(6),     /* u */
	reference char(1),   /* r */
	class char(1),       /* m */
	subclass char(1),    /* a */
	
	/* syllable and one-syllable word */
	leadingconsonant varchar(5),
	finalconsonant varchar(5),
	vowelpattern varchar(10),
	tonemark char(1),
	tone char(1),
	translit varchar(100),
	rules varchar(100),
	
	/* multi-syllable word and phrase */
	numsyllables int,
	syllablendx varchar(20),
	components varchar(500)
);
