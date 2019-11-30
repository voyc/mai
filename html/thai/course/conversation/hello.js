/*
1. to display any page
	find texts on the page (always english)
	translate to thai
	lookup in vocab
	if in vocab, use thai

2. start conversation
	persons:
		self: name, age, gender
		other: name, age, gender
		third: name, age, gender

3. in lessons, use local patterns, added auto to grammar
	functions
		@polite (depends on gender of speaker)
		@person('self', 'name')
		@person('self', 'age')
		@person('self', 'gender')
		@person('other', 'name')
		@person('other', 'age')
		@person('other', 'gender')
		@person('third', 'name')
		@person('third', 'age')
		@person('third', 'gender')

4. load lessons dynamically

5. generate list of lessons dynamically

6. perequisites
	glyphs
	words
	phrases?


@person('self', 'name'): สวัส ดี่ [@polite]
*/

voyc.lesson.conversation = {};
voyc.lesson.conversation.levels = ['white','red','purple','black'];
voyc.lesson.conversation.white = {
		id:'ki',
		section: 'white',
		name: 'Index and Middle Finger',
		sequence: 1,
		algorithm: 'sequential',
		initialShuffle: false,
		workSize:3,
		phases: ['glyph', 'word', 'word-reverse', 'phrase', 'phrase-reverse'],
		phasen: 0,
		glyph: ['พ','ี','อ','ท','ำ','ร','แ','ม'],
		word:[],
		phrase:[],
	list: [
		'John: สวัส ดี่ ครับ', 
		'Juan: สวัส ดี่ คะ',
		'John: สขาย ดี่ ไหม ครับ', 
		'Juan: สขาย ดี่ คะ',
		'Juan: [แลัว] คุณ ล่ะ',
		'John: สขาย ดี่ ครับ ',
	]
}};
voyc.onLessonLoaded('conversation');
