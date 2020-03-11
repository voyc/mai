fixed: ผม pmoL noun hair  pomR


ผ ข ฉ ถ high-class
พ ค ช ท low-class 


tone yellow postreq should make phrases from the words in this level
eliminate the Q:xxx A:xxx sentences, too hard to type
using pattern in the phrases is too repetitive, man handsome, manhandsome isn't it, etc


open syllables group by tone

give hint only on request
on correct answer, say only "correct"

multiple syllable translit, function to fix tones and translate by translit table

components and syllablendx are redundant, sort of

psql -U voyccom_jhagstrand -d voyccom_mai -c "select id,thai,eng,tone from mai.thaidict where numsyllables = 1 and finalconsonant = ''"
psql -U voyccom_jhagstrand -d voyccom_mai -c "select tone,count(*) from mai.thaidict where numsyllables = 1 and finalconsonant = '' group by tone"

# question: what is the final consonant
 where id=1417; /* สรร  */"~ | choose           | ส                | oรร          |                |          | R

