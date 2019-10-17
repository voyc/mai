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
