﻿/*
	Thai alphabet
*/

(function() {   // create a local scope

var alphabet = {};

alphabet.lang = 'th'

alphabet.alphabet = {
//   index    db-id   unicode         translit filename                           row/col   name
	0x0e00:	{ i:6536, u:0x0e00, s:'฀',	t:''	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:1, g: 0, n:'blank'       },
	0x0e01:	{ i:6537, u:0x0e01, s:'ก',	t:'kg'	,f:''	,p:'c',m:'m',a:' ', rx:1,cx: 1, r:3,c: 3,cs:1, g: 1, n:''            },
	0x0e02:	{ i:6538, u:0x0e02, s:'ข',	t:'k'	,f:''	,p:'c',m:'h',a:' ', rx:2,cx: 2, r:1,c:11,cs:1, g: 9, n:''            },
	0x0e03:	{ i:6539, u:0x0e03, s:'ฃ',	t:'s'	,f:''	,p:'o',m:' ',a:' ', rx:0,cx: 0, r:3,c:12,cs:1, g: 0, n:'obsolete'    },
	0x0e04:	{ i:6540, u:0x0e04, s:'ค',	t:'k'	,f:''	,p:'c',m:'l',a:' ', rx:3,cx: 2, r:1,c: 8,cs:1, g: 9, n:''            },
	0x0e05:	{ i:6541, u:0x0e05, s:'ฅ',	t:'o'	,f:''	,p:'o',m:' ',a:' ', rx:0,cx: 0, r:3,c:12,cs:2, g: 0, n:'obsolete'    },
	0x0e06:	{ i:6542, u:0x0e06, s:'ฆ',	t:'ค'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 6, r:3,c: 2,cs:2, g: 0, n:''            },
	0x0e07:	{ i:6543, u:0x0e07, s:'ง',	t:'ng'	,f:''	,p:'c',m:'l',a:'s', rx:4,cx: 7, r:3,c:11,cs:1, g: 7, n:''            },
	0x0e08:	{ i:6544, u:0x0e08, s:'จ',	t:'j'	,f:''	,p:'c',m:'m',a:' ', rx:1,cx: 6, r:1,c:10,cs:1, g: 9, n:''            },
	0x0e09:	{ i:6545, u:0x0e09, s:'ฉ',	t:'ch'	,f:''	,p:'c',m:'h',a:' ', rx:2,cx: 6, r:4,c: 4,cs:2, g: 0, n:''            },
	0x0e0A:	{ i:6546, u:0x0e0A, s:'ช',	t:'ch'	,f:''	,p:'c',m:'l',a:' ', rx:3,cx: 6, r:1,c:12,cs:1, g: 9, n:''            },
	0x0e0B:	{ i:6547, u:0x0e0B, s:'ซ',	t:'s'	,f:''	,p:'c',m:'l',a:' ', rx:3,cx: 1, r:3,c:10,cs:2, g: 0, n:''            },
	0x0e0C:	{ i:6548, u:0x0e0C, s:'ฌ',	t:'ช'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx:11, r:3,c: 5,cs:2, g: 0, n:''            },
	0x0e0D:	{ i:6549, u:0x0e0D, s:'ญ',	t:'ย'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx:14, r:2,c:10,cs:2, g: 0, n:''            },
	0x0e0E:	{ i:6550, u:0x0e0E, s:'ฎ',	t:'ด'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 1, r:2,c: 3,cs:2, g: 0, n:''            },
	0x0e0F:	{ i:6551, u:0x0e0F, s:'ฏ',	t:'ต'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 2, r:3,c: 3,cs:2, g: 0, n:''            },
	0x0e10:	{ i:6552, u:0x0e10, s:'ฐ',	t:'ถ'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 5, r:2,c:11,cs:2, g: 0, n:''            },
	0x0e11:	{ i:6553, u:0x0e11, s:'ฑ',	t:'ท'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 8, r:2,c: 4,cs:2, g: 0, n:''            },
	0x0e12:	{ i:6554, u:0x0e12, s:'ฒ',	t:'ท'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx:10, r:4,c: 9,cs:2, g: 0, n:''            },
	0x0e13:	{ i:6555, u:0x0e13, s:'ณ',	t:'น'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx:12, r:2,c: 8,cs:2, g: 0, n:''            },
	0x0e14:	{ i:6556, u:0x0e14, s:'ด',	t:'d'	,f:''	,p:'c',m:'m',a:' ', rx:1,cx: 2, r:3,c: 4,cs:1, g: 1, n:''            },
	0x0e15:	{ i:6557, u:0x0e15, s:'ต',	t:'dt'	,f:''	,p:'c',m:'m',a:' ', rx:1,cx: 3, r:1,c: 9,cs:1, g: 9, n:''            },
	0x0e16:	{ i:6558, u:0x0e16, s:'ถ',	t:'t'	,f:''	,p:'c',m:'h',a:' ', rx:2,cx: 3, r:1,c: 5,cs:1, g: 8, n:''            },
	0x0e17:	{ i:6559, u:0x0e17, s:'ท',	t:'t'	,f:''	,p:'c',m:'l',a:' ', rx:3,cx: 3, r:4,c: 8,cs:1, g: 2, n:''            },
	0x0e18:	{ i:6560, u:0x0e18, s:'ธ',	t:'ท'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 9, r:2,c: 5,cs:2, g: 0, n:''            },
	0x0e19:	{ i:6561, u:0x0e19, s:'น',	t:'n'	,f:''	,p:'c',m:'l',a:'s', rx:4,cx: 2, r:2,c: 9,cs:1, g: 4, n:''            },
	0x0e1A:	{ i:6562, u:0x0e1A, s:'บ',	t:'b'	,f:''	,p:'c',m:'m',a:' ', rx:1,cx: 4, r:2,c:11,cs:1, g: 7, n:''            },
	0x0e1B:	{ i:6563, u:0x0e1B, s:'ป',	t:'bp'	,f:''	,p:'c',m:'m',a:' ', rx:1,cx: 5, r:4,c: 3,cs:1, g: 4, n:''            },
	0x0e1C:	{ i:6564, u:0x0e1C, s:'ผ',	t:'p'	,f:''	,p:'c',m:'h',a:' ', rx:2,cx: 4, r:4,c: 2,cs:1, g: 5, n:''            },
	0x0e1D:	{ i:6565, u:0x0e1D, s:'ฝ',	t:'f'	,f:''	,p:'c',m:'h',a:' ', rx:2,cx: 5, r:4,c:11,cs:1, g: 5, n:''            },
	0x0e1E:	{ i:6566, u:0x0e1E, s:'พ',	t:'p'	,f:''	,p:'c',m:'l',a:' ', rx:3,cx: 4, r:2,c: 4,cs:1, g: 2, n:''            },
	0x0e1F:	{ i:6567, u:0x0e1F, s:'ฟ',	t:'f'	,f:''	,p:'c',m:'l',a:' ', rx:3,cx: 5, r:3,c: 1,cs:1, g: 1, n:''            },
	0x0e20:	{ i:6568, u:0x0e20, s:'ภ',	t:'พ'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 7, r:1,c: 4,cs:1, g: 8, n:''            },
	0x0e21:	{ i:6571, u:0x0e21, s:'ม',	t:'m'	,f:''	,p:'c',m:'l',a:'s', rx:4,cx: 1, r:4,c: 9,cs:1, g: 3, n:''            },
	0x0e22:	{ i:6572, u:0x0e22, s:'ย',	t:'y'	,f:''	,p:'c',m:'l',a:'s', rx:4,cx: 6, r:2,c:10,cs:1, g: 5, n:''            },
	0x0e23:	{ i:6573, u:0x0e23, s:'ร',	t:'r'	,f:''	,p:'c',m:'l',a:'s', rx:4,cx: 4, r:2,c: 8,cs:1, g: 3, n:''            },
	0x0e24:	{ i:6573, u:0x0e24, s:'ฤ',	t:'pri'	,f:''	,p:'b',m:' ',a:' ', rx:4,cx:14, r:3,c: 1,cs:2, g: 0, n:''            },
	0x0e25:	{ i:6574, u:0x0e25, s:'ล',	t:'l'	,f:''	,p:'c',m:'l',a:'s', rx:4,cx: 3, r:2,c:12,cs:1, g: 7, n:''            },
	0x0e26:	{ i:6575, u:0x0e26, s:'ฦ',	t:''	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:4,c:11,cs:2, g: 0, n:'unknown'     },
	0x0e27:	{ i:6576, u:0x0e27, s:'ว',	t:'w'	,f:''	,p:'c',m:'l',a:'s', rx:4,cx: 5, r:3,c:10,cs:1, g: 1, n:''            },
	0x0e28:	{ i:6577, u:0x0e28, s:'ศ',	t:'ส'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 4, r:3,c: 9,cs:2, g: 0, n:''            },
	0x0e29:	{ i:6578, u:0x0e29, s:'ษ',	t:'ส'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx: 3, r:3,c: 8,cs:2, g: 0, n:''            },
	0x0e2A:	{ i:6579, u:0x0e2A, s:'ส',	t:'s'	,f:''	,p:'c',m:'h',a:' ', rx:2,cx: 1, r:3,c: 9,cs:1, g: 1, n:''            },
	0x0e2B:	{ i:6580, u:0x0e2B, s:'ห',	t:'h'	,f:''	,p:'c',m:'h',a:' ', rx:2,cx: 7, r:3,c: 2,cs:1, g: 1, n:''            },
	0x0e2C:	{ i:6581, u:0x0e2C, s:'ฬ',	t:'ล'	,f:''	,p:'c',m:' ',a:'k', rx:5,cx:13, r:4,c:10,cs:2, g: 0, n:''            },
	0x0e2D:	{ i:6582, u:0x0e2D, s:'อ',	t:'aw'	,f:''	,p:'c',m:'m',a:' ', rx:1,cx: 7, r:4,c: 5,cs:1, g: 2, n:''            },
	0x0e2E:	{ i:6583, u:0x0e2E, s:'ฮ',	t:'h'	,f:''	,p:'c',m:'l',a:' ', rx:3,cx: 7, r:4,c: 5,cs:2, g: 0, n:''            },
	0x0e2F:	{ i:6584, u:0x0e2F, s:'ฯ',	t:'abbr',f:''	,p:'s',m:' ',a:' ', rx:6,cx:13, r:2,c: 9,cs:2, g: 0, n:'abbreviation'},
	0x0e30:	{ i:6585, u:0x0e30, s:'ะ',	t:'a'	,f:''	,p:'v',m:' ',a:' ', rx:2,cx:10, r:2,c: 5,cs:1, g: 6, n:''            },
	0x0e31:	{ i:6586, u:0x0e31, s:'ั',	t:'a'	,f:''	,p:'v',m:' ',a:' ', rx:1,cx:12, r:2,c: 6,cs:1, g: 6, n:''            },
	0x0e32:	{ i:6587, u:0x0e32, s:'า',	t:'aa'	,f:''	,p:'v',m:' ',a:' ', rx:2,cx:11, r:3,c: 8,cs:1, g: 1, n:''            },
	0x0e33:	{ i:6588, u:0x0e33, s:'ำ',	t:'am'	,f:''	,p:'b',m:' ',a:' ', rx:2,cx:12, r:2,c: 3,cs:1, g: 3, n:''            },
	0x0e34:	{ i:6589, u:0x0e34, s:'ิ',	t:'i'	,f:''	,p:'v',m:' ',a:' ', rx:1,cx: 8, r:4,c: 6,cs:1, g: 6, n:''            },
	0x0e35:	{ i:6590, u:0x0e35, s:'ี',	t:'ii'	,f:''	,p:'v',m:' ',a:' ', rx:1,cx: 9, r:2,c: 7,cs:1, g: 2, n:''            },
	0x0e36:	{ i:6591, u:0x0e36, s:'ึ',	t:'ʉ'	,f:''	,p:'v',m:' ',a:' ', rx:1,cx:10, r:1,c: 7,cs:1, g: 8, n:''            },
	0x0e37:	{ i:6592, u:0x0e37, s:'ื',	t:'ʉʉ'	,f:''	,p:'v',m:' ',a:' ', rx:1,cx:11, r:4,c: 7,cs:1, g: 6, n:''            },
	0x0e38:	{ i:6593, u:0x0e38, s:'ุ',	t:'u'	,f:''	,p:'v',m:' ',a:' ', rx:2,cx: 8, r:1,c: 6,cs:1, g: 8, n:''            },
	0x0e39:	{ i:6593, u:0x0e39, s:'ู',	t:'uu'	,f:''	,p:'v',m:' ',a:' ', rx:2,cx: 9, r:1,c: 6,cs:2, g: 0, n:''            },
	0x0e3A:	{ i:6594, u:0x0e3A, s:'ฺ',	t:''	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:4,c: 6,cs:2, g: 0, n:'unknown'     },
	0x0e3B:	{ i:6595, u:0x0e3B, s:'฻',	t:''	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'blank'       },
	0x0e3C:	{ i:6596, u:0x0e3C, s:'฼',	t:''	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'blank'       },
	0x0e3D:	{ i:6597, u:0x0e3D, s:'฽',	t:''	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'blank'       },
	0x0e3E:	{ i:6598, u:0x0e3E, s:'฾',	t:''	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'blank'       },
	0x0e3F:	{ i:6599, u:0x0e3F, s:'฿',	t:'baht',f:''	,p:'s',m:' ',a:' ', rx:6,cx:12, r:1,c: 7,cs:2, g: 0, n:'baht'        },
	0x0e40:	{ i:6600, u:0x0e40, s:'เ',	t:'e'	,f:''	,p:'v',m:' ',a:' ', rx:3,cx: 8, r:3,c: 5,cs:1, g: 6, n:''            },
	0x0e41:	{ i:6601, u:0x0e41, s:'แ',	t:'ee'	,f:''	,p:'v',m:' ',a:' ', rx:3,cx: 9, r:4,c: 4,cs:1, g: 3, n:''            },
	0x0e42:	{ i:6602, u:0x0e42, s:'โ',	t:'o'	,f:''	,p:'v',m:' ',a:' ', rx:3,cx:10, r:3,c: 4,cs:2, g: 0, n:''            },
	0x0e43:	{ i:6603, u:0x0e43, s:'ใ',	t:'ai'	,f:''	,p:'v',m:' ',a:' ', rx:3,cx:11, r:4,c:10,cs:1, g: 4, n:''            },
	0x0e44:	{ i:6604, u:0x0e44, s:'ไ',	t:'ai'	,f:''	,p:'v',m:' ',a:' ', rx:3,cx:12, r:2,c: 2,cs:1, g: 4, n:''            },
	0x0e45:	{ i:6605, u:0x0e45, s:'ๅ',	t:''	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:1,c: 1,cs:1, g: 0, n:'unknown'     },
	0x0e46:	{ i:6606, u:0x0e46, s:'ๆ',	t:'rept',f:''	,p:'s',m:' ',a:' ', rx:6,cx:14, r:2,c: 1,cs:1, g: 5, n:'repeat'      },
	0x0e47: { i:0000, u:0x0e47, s:'็',	t:'e'	,f:''	,p:'v',m:' ',a:' ', rx:1,cx:13, r:3,c: 6,cs:2, g: 0, n:''            },
	0x0e48: { i:0000, u:0x0e48, s:'่',	t:'1'	,f:''	,p:'t',m:' ',a:' ', rx:4,cx: 8, r:3,c: 7,cs:1, g: 1, n:''            },
	0x0e49: { i:0000, u:0x0e49, s:'้',	t:'2'	,f:''	,p:'t',m:' ',a:' ', rx:4,cx: 9, r:3,c: 6,cs:1, g: 6, n:''            },
	0x0e4A: { i:0000, u:0x0e4A, s:'๊',	t:'3'	,f:''	,p:'t',m:' ',a:' ', rx:4,cx:10, r:2,c: 7,cs:2, g: 0, n:''            },
	0x0e4B: { i:0000, u:0x0e4B, s:'๋',	t:'4'	,f:''	,p:'t',m:' ',a:' ', rx:4,cx:11, r:3,c: 7,cs:2, g: 0, n:''            },
	0x0e4C:	{ i:6596, u:0x0e4C, s:'์',	t:'silnt',f:''	,p:'t',m:' ',a:' ', rx:4,cx:12, r:4,c: 7,cs:2, g: 0, n:''            },
	0x0e4D:	{ i:6597, u:0x0e4D, s:'ํ',	t:''	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:2,c: 6,cs:2, g: 0, n:'unknown'     },
	0x0e4E:	{ i:6598, u:0x0e4E, s:'๎',	t:'' 	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'unknown'     },
	0x0e4F:	{ i:6599, u:0x0e4F, s:'๏',	t:'' 	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'unknown'     },
	0x0e50:	{ i:6600, u:0x0e50, s:'๐',	t:'0'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx:10, r:2,c: 1,cs:2, g: 0, n:''            },
	0x0e51:	{ i:6601, u:0x0e51, s:'๑',	t:'1'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 1, r:1,c: 2,cs:2, g: 0, n:''            },
	0x0e52:	{ i:6602, u:0x0e52, s:'๒',	t:'2'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 2, r:1,c: 3,cs:2, g: 0, n:''            },
	0x0e53:	{ i:6603, u:0x0e53, s:'๓',	t:'3'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 3, r:1,c: 4,cs:2, g: 0, n:''            },
	0x0e54:	{ i:6604, u:0x0e54, s:'๔',	t:'4'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 4, r:1,c: 5,cs:2, g: 0, n:''            },
	0x0e55:	{ i:6605, u:0x0e55, s:'๕',	t:'5'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 5, r:1,c: 8,cs:2, g: 0, n:''            },
	0x0e56:	{ i:6606, u:0x0e56, s:'๖',	t:'6'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 6, r:1,c: 9,cs:2, g: 0, n:''            },
	0x0e57: { i:0000, u:0x0e57, s:'๗',	t:'7'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 7, r:1,c:10,cs:2, g: 0, n:''            },
	0x0e58: { i:0000, u:0x0e58, s:'๘',	t:'8'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 8, r:1,c:11,cs:2, g: 0, n:''            },
	0x0e59: { i:0000, u:0x0e59, s:'๙',	t:'9'	,f:''	,p:'d',m:' ',a:' ', rx:6,cx: 9, r:1,c:12,cs:2, g: 0, n:''            },
	0x0e5A: { i:0000, u:0x0e5A, s:'๚',	t:''	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'unknown'     },
	0x0e5B: { i:0000, u:0x0e5B, s:'๛',	t:'' 	,f:''	,p:'u',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'unknown'     },
	0x0020: { i:0000, u:0x0020, s:' ',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:0,c: 0,cs:0, g: 0, n:'space'       },
	0x0021: { i:0000, u:0x0020, s:'/',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:1,c: 2,cs:1, g: 0, n:'slash'       },
	0x0022: { i:0000, u:0x0020, s:'-',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:1,c: 3,cs:1, g: 0, n:'dash'        },
	0x0023: { i:0000, u:0x0020, s:'+',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:1,c: 1,cs:2, g: 0, n:'plus'        },
	0x0024: { i:0000, u:0x0020, s:'"',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:2,c: 2,cs:2, g: 0, n:'quotes'      },
	0x0025: { i:0000, u:0x0020, s:',',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:2,c:12,cs:2, g: 0, n:'comma'       },
	0x0026: { i:0000, u:0x0020, s:'.',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:3,c:11,cs:2, g: 0, n:'period'      },
	0x0027: { i:0000, u:0x0020, s:'(',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:4,c: 2,cs:2, g: 0, n:'paren-open'  },
	0x0028: { i:0000, u:0x0020, s:')',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:4,c: 3,cs:2, g: 0, n:'paren-close' },
	0x0029: { i:0000, u:0x0020, s:'?',	t:' '	,f:''	,p:' ',m:' ',a:' ', rx:0,cx: 0, r:4,c: 8,cs:2, g: 0, n:'question'    },
};

alphabet.tags = {
	vowel:		{t:'p', v:'v', label:'Vowel'},
	consonant:	{t:'p', v:'c', label:'Consonant'},
	tonemark:	{t:'p', v:'t', label:'Tone Mark'},
	digit:		{t:'p', v:'d', label:'Digit'},
	special:	{t:'p', v:'s', label:'Special'},
	combo:		{t:'p', v:'b', label:'Combo'},
	obsolete:	{t:'p', v:'o', label:'Obsolete'},
	unknown:	{t:'p', v:'u', label:'Unknown'},

	// class
	mid:		{t:'m', v:'m', label:'Middle Class'},
	high:		{t:'m', v:'h', label:'High Class'},
	low:		{t:'m', v:'l', label:'Low Class'},

	sonorant:	{t:'a', v:'s', label:'Sonorant'},
	sanskrit:	{t:'a', v:'k', label:'Sanskrit'},
}

alphabet.empties = [
//	{r:1,c:14},
//	{r:2,c:13},
//	{r:2,c:14},
//	{r:3,c:13},
//	{r:3,c:14},
//	{r:4,c:13},
];

window.voyc.onAlphabetLoaded(alphabet);
}());
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
