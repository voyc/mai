/* 
This SQL is designed for postgres.

After creating this schema, execute the GRANT statements found in the comments section of the config.php file.
*/

/* drop schema mai cascade; */
create schema mai;

create table mai.profile (
	id serial primary key,
	userid integer,
	gender char(1),
	photo varchar(250),
	phone varchar(20)
);
