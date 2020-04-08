/*
psql  -U voyccom_jhagstrand -d voyccom_mai -c "update mai.thaidict set subclass='a' where id = 67;"
psql -U voyccom_jhagstrand -d voyccom_mai -c "update mai.thaidict set type='m' where id in (1462,1463,1423,277,1346);"
*/

/*
update mai.thaidict set type='o',eng='travel',pos='v',translit='tiaao',tone='F' where id =  595; /* เที่ยว */ 
update mai.thaidict set type='o',tone='M' where id =  985; /* เรียน */ 

update mai.thaidict set eng='price',pos='n',translit='raaMkaaM' where id =  958; /* ราคา   */
update mai.thaidict set numsyllables=3,translit='aaMtitH' where id = 1258; /* อาทิตย์  */
update mai.thaidict set eng='station',pos='n',numsyllables=3,translit='saLtaaRniiM' where id = 1089; /* สถานี   */
update mai.thaidict set translit='taoFraiL' where id = 1334; /* เท่าไหร่ */
update mai.thaidict set eng='approximately',pos='e',translit='bpraLmaanM' where id =  712; /* ประมาณ */
update mai.thaidict set eng='where',translit='tiiFnaiR' where id = 1367; /* ที่ไหน   */
update mai.thaidict set eng='hour',pos='n',translit='chuaaFmoongM' where id =  395; /* ชั่วโมง  */
update mai.thaidict set translit='tiiFnohnF' where id = 1336; /* ที่โน่น   */

psql -U voyccom_jhagstrand -d voyccom_mai -c "update mai.thaidict set leadingconsonant='ท',vowelpattern='เoีย',finalconsonant='ว',tonemark='่' where id = 595;"
*/
