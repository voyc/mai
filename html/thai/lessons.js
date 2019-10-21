/**
**/
voyc.lessons = [
	{
		section: 'keyboard',
		name: 'home keys',
		sequence: 1,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:3,
		phases:['drill','collect'],
		cards: ['ด','่','ก','า','ห','ส','ฟ','ว']

	},{
		section: 'keyboard',
		name: 'index finger',
		sequence: 2,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases:['drill','collect'],
		cards: ['พ','ี','อ','ท']
	},{
		section: 'keyboard',
		name: 'middle finger',
		sequence: 3,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases:['drill','collect'],
		cards: ['ำ','ร','แ','ม'] 
	},{
		section: 'keyboard',
		name: 'ring finger',
		sequence: 4,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases:['drill','collect'],
		cards: ['ไ','น','ป','ใ']
	},{
		section: 'keyboard',
		name: 'pinkie',
		sequence: 5,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases:['drill','collect'],
		cards: ['ๆ','ย','ผ','ฝ']
	},{
		section: 'keyboard',
		name: 'index finger center',
		sequence: 6,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases:['drill','collect'],
		cards: ['เ','้','ะ','ั','ิ','ื']
	},{
		section: 'keyboard',
		name: 'pinkie reach',
		sequence: 7,
		algorithm: 'progressive',
		initialShuffle: false,
		workSize:4,
		phases:['drill','collect'],
		cards: ['ง','บ','ล']
	}
];

/*
user profile must contain a list of lessons that have been completed
or, can vocab contain lessons in work or mastered

section/name  state

*/

/*
ด่กาหสฟว 1    home keys
พีอท     2   index finger
ำรแม    3    middle finger
ไนปใ    4    ring finger
ๆยผฝ    5    pinkie
เ้ะัิื      6     index finger center
งบล     7     pinkie reach
ภึถุ      8     high index finger
คตๅจขช  9     high right hand


โ๋ฏษฆศฤซ    shift home keys
ฑ๊ฮ?        shift index finger
ฎณฉฒ        shift middle finger
"ฯ)ฬ           shift ring finger
๐ญ(ฦ          shift pinkie
ฌ็ธํฺ์             shift center
.ฐ,        shift pinkie reach
ู฿             shift high index finger
๑๒๓๔๕๖๗๘๙    shift digits


()ฺ.,"%+    punctuation
_/-         shift punctuation

ๆฯ               symbols
฿               shift symbols
*/
