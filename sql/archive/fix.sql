# learning goal, tones
  ผ ข ฉ ถ high-class
  พ ค ช ท low-class 
  choose open syllables with level 100
  Num 1
  No final cons
  Group by vowel pattern
  Group by tonemark
  Group by leading cons class

Make sentence using only the words learned in this lesson

is it possible to learn all at once:
  the alphabet
  typing/keyboard, writing
  consonants leading
  vowel patterns
  consonants final
  tonemarks
  vocabulary
  sentence structures
  useful dialogues

# sengen
- curriculum tones
  - yellow postreq should make phrases from the words in this level
  - eliminate the Q:xxx A:xxx sentences, too hard to type
  - using pattern in the phrases is too repetitive, man handsome, manhandsome isnt-it, etc

- give hint only on request.  on correct answer, say only "correct"

- multiple syllable translit, function to fix tones and translate by translit table

# database design
- components and syllablendx are redundant, sort of
- vocab with multiple pos, with multiple meanings

- question: what is the final consonant in the word สรร ?

# architecture
  - speaking
  - hearing
  - chatbot

# open syllables group by tone

psql -U voyccom_jhagstrand -d voyccom_mai -c "select id,thai,eng,tone from mai.thaidict where numsyllables = 1 and finalconsonant = ''"

psql -U voyccom_jhagstrand -d voyccom_mai -c "select tonemark,count(*) from mai.thaidict where thai in ('กี่','แก่','ไก่','เกาะ','เก้า','ขอ','ขา','เขา','ไข่','เข้า','คอ','ค่ะ','เคย','งู','ไง','จะ','จำ','ใจ','เจอ','ชา','ช้า','ใช่','ชื่อ','เช้า','ซื้อ','ดำ','ดี','ดู','ใด','เคย','ได้','ตา','ตัว','แต่','ใต้','โต๊ะ','เตี้ย','ถือ','ถ้า','ทา','ทำ','ที่','เท่า','เท้า','นา','ใน','นี่','น้ำ','เนื้อ','โบ','บัว','เบา','ปี','ปู','ไป','ป่า','ผ้า','พอ','พา','พี่','พ่อ','ไฟ','ฟ้า','มา','มี','มือ','ม้า','เมา','แม่','ไม่','เมีย','เมื่อ','ยา','รู','รู้','เรา','เลย','และ','ว่า','สี','สี่','เสีย','เสือ','เสื้อ','หา','หู','หัว','ห้า','ให้','เอา','ไกล','ใกล้','กว่า','ขวา','ครู','ใหญ่','ปลา','หนู','ไหน','หน้า','เหนือ','หมอ','หมา','หมู','ไหม','อยู่') group by tonemark order by tonemark;"


