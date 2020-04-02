/*                                                               id  | type | thai | pos | class | subclass */
/* move pos to class for glyphs, pos is only for words. */
update mai.thaidict set pos='',class='v',subclass='' where id=51; /* | g    | ำ    | b   | o     | d*/
update mai.thaidict set pos='',class='b',subclass='' where id=36; /* | g    | ฤ    | b   |       |  */
update mai.thaidict set pos='',class='d',subclass='' where id=81; /* | g    | ๖    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=82; /* | g    | ๗    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=83; /* | g    | ๘    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=84; /* | g    | ๙    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=79; /* | g    | ๔    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=80; /* | g    | ๕    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=75; /* | g    | ๐    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=76; /* | g    | ๑    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=77; /* | g    | ๒    | d   |       | */ 
update mai.thaidict set pos='',class='d',subclass='' where id=78; /* | g    | ๓    | d   |       | */ 
update mai.thaidict set pos='',class='o',subclass=''  where id= 3; /* | g    | ฃ    | o   |       |   */
update mai.thaidict set pos='',class='o',subclass=''  where id= 5; /* | g    | ฅ    | o   |       |   */
update mai.thaidict set pos='',class='s',subclass=''  where id=59; /* | g    | ฿    | s   |       |   */
update mai.thaidict set pos='',class='s',subclass=''  where id=66; /* | g    | ๆ    | s   |       |   */
update mai.thaidict set pos='',class='s',subclass=''  where id=47; /* | g    | ฯ    | s   |       |   */
update mai.thaidict set pos='',class='t',subclass='a' where id=69; /* | g    | ้     | t   |       | d */
update mai.thaidict set pos='',class='t',subclass='a' where id=70; /* | g    | ๊     | t   |       | d */
update mai.thaidict set pos='',class='t',subclass='a' where id=71; /* | g    | ๋     | t   |       | d */
update mai.thaidict set pos='',class='t',subclass='a' where id=72; /* | g    | ์     | t   |       | d */
update mai.thaidict set pos='',class='t',subclass='a' where id=68; /* | g    | ่     | t   |       | d */
update mai.thaidict set pos='',class='u',subclass=''  where id=85; /* | g    | ๚    | u   |       |   */
update mai.thaidict set pos='',class='o',subclass=''  where id=38; /* | g    | ฦ    | u   |       |   */
update mai.thaidict set pos='',class='u',subclass='b' where id=58; /* | g    | ฺ     | u   |       | d */
update mai.thaidict set pos='',class='u',subclass=''  where id=65; /* | g    | ๅ    | u   |       |   */
update mai.thaidict set pos='',class='u',subclass='a' where id=73; /* | g    | ํ     | u   |       | d */
update mai.thaidict set pos='',class='u',subclass='a' where id=74; /* | g    | ๎     | u   |       | d */
update mai.thaidict set pos='',class='s',subclass=''  where id=86; /* | g    | ๛    | u   |       |   */

/* fix pos for words */
update mai.thaidict set pos='j', class='',subclass='' where id=1359; /* | m    | แน่ใจ | i   |       | */
update mai.thaidict set pos='a', class='',subclass='' where id=1313; /* | o    | ไหร่  | s   |       |   */
update mai.thaidict set pos='a', class='',subclass='' where id= 996; /* | o    | ไร   | s   |       |   */
update mai.thaidict set pos='e', class='',subclass='' where id= 624; /* | o    | นัก   | x   |       |   */
update mai.thaidict set pos='e', class='',subclass='' where id= 634; /* | o    | น่า   | x   |       |   */
update mai.thaidict set pos='n', class='',subclass='' where id= 469; /* | o    | ต้น   | x   |       |   */
update mai.thaidict set pos='n', class='',subclass='' where id= 756; /* | o    | ผู้    | x   |       |   */
update mai.thaidict set pos='e', class='',subclass='' where id= 633; /* | o    | น่า   | x   |       |   */

/* add diacritic position for all vowel glyphs */
update mai.thaidict set pos='', class='v',subclass='r' where id= 48; /* | g    | ะ    | v   | s     |   */
update mai.thaidict set pos='', class='v',subclass='a' where id= 49; /* | g    | ั     | v   | s     |   */
update mai.thaidict set pos='', class='v',subclass='r' where id= 50; /* | g    | า    | v   | o     |   */
update mai.thaidict set pos='', class='v',subclass='r' where id= 51; /* | g    | ำ    | b   | o     | d */
update mai.thaidict set pos='', class='v',subclass='a' where id= 52; /* | g    | ิ     | v   | s     | d */
update mai.thaidict set pos='', class='v',subclass='a' where id= 53; /* | g    | ี     | v   | o     | d */
update mai.thaidict set pos='', class='v',subclass='a' where id= 54; /* | g    | ึ     | v   | s     | d */
update mai.thaidict set pos='', class='v',subclass='a' where id= 55; /* | g    | ื     | v   | o     | d */
update mai.thaidict set pos='', class='v',subclass='b' where id= 56; /* | g    | ุ     | v   | s     | d */
update mai.thaidict set pos='', class='v',subclass='b' where id= 57; /* | g    | ู     | v   | o     | d */
update mai.thaidict set pos='', class='v',subclass='l' where id= 60; /* | g    | เ    | v   | s     |   */
update mai.thaidict set pos='', class='v',subclass='l' where id= 61; /* | g    | แ    | v   | o     |   */
update mai.thaidict set pos='', class='v',subclass='l' where id= 62; /* | g    | โ    | v   | o     |   */
update mai.thaidict set pos='', class='v',subclass='l' where id= 63; /* | g    | ใ    | v   | o     |   */
update mai.thaidict set pos='', class='v',subclass='l' where id= 64; /* | g    | ไ    | v   | o     |   */
