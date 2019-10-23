/*
select thai, class from mai.thaidict where thai in ('ค','ช','ย','ด','ต','ถ','ท','น','พ','ส','ล');
 thai | class 
------+-------
 ค    | l
 ช    | l
 ด    | m
 ต    | m
 ถ    | h
 ท    | l
 น    | l
 พ    | l
 ย    | l
 ล    | l
 ส    | h
*/
update mai.thaidict set class = 'l', subclass=' ' where reference = 'ค';
update mai.thaidict set class = 'l', subclass=' ' where reference = 'ช';
update mai.thaidict set class = 'm', subclass=' ' where reference = 'ด';
update mai.thaidict set class = 'm', subclass=' ' where reference = 'ต';
update mai.thaidict set class = 'h', subclass=' ' where reference = 'ถ';
update mai.thaidict set class = 'l', subclass=' ' where reference = 'ท';
update mai.thaidict set class = 'l', subclass='s' where reference = 'น';
update mai.thaidict set class = 'l', subclass=' ' where reference = 'พ';
update mai.thaidict set class = 'l', subclass='s' where reference = 'ย';
update mai.thaidict set class = 'l', subclass='s' where reference = 'ล';
update mai.thaidict set class = 'h', subclass=' ' where reference = 'ส';
